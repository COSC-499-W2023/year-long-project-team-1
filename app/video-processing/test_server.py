import pytest
import pytest_asyncio
from unittest.mock import patch, MagicMock
from server import app


@patch('video_processor.VideoProcessor.process', MagicMock(return_value=None))
@patch('process_tracker.ProcessTracker.main', MagicMock(return_value=None))
class TestServer:
    @pytest_asyncio.fixture(name="app", scope="function")
    async def _app(self):
        async with app.test_app() as test_app:
            yield test_app

    @pytest.mark.asyncio
    async def test_process_video_file_not_found(self, app):
        client = app.test_client()
        route = "/process_video"
        response = await client.post(route, query_string={"filename": "blahblahblah invalid file"})
        assert "Error: file not found" == (await response.get_data()).decode("utf-8")
        assert 404 == response.status_code

    @pytest.mark.asyncio
    async def test_process_video_file_found(self, app):
        client = app.test_client()
        route = "/process_video"
        response = await client.post(route, query_string={"filename": "test.mp4"})
        assert "Success: file exists." == (await response.get_data()).decode("utf-8")
        assert 202 == response.status_code

    @pytest.mark.asyncio
    async def test_process_video_method_not_allowed(self, app):
        client = app.test_client()
        route = "/process_video"
        for method in [client.get, client.put, client.delete, client.trace, client.patch]:
            response = await method(route)
            assert 405 == response.status_code

    @pytest.mark.asyncio
    async def test_health(self, app):
        client = app.test_client()
        route = "/health"
        response = await client.get(route)
        json = dict(await response.get_json())  # convert binary string to dictionary
        assert {} == json
        assert 200, response.status_code

    @pytest.mark.asyncio
    async def test_health_method_not_allowed(self, app):
        client = app.test_client()
        route = "/health"
        for method in [client.put, client.post, client.delete, client.trace, client.patch]:
            response = await method(route)
            assert 405 == response.status_code
