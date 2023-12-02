import pytest
import pytest_asyncio
from unittest.mock import patch, MagicMock
from server import app
from process_tracker import ProcessTrackerObject, mp
import time


def demo_func():
    time.sleep(1)


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
    async def test_process_status_process_not_found(self, app):
        client = app.test_client()
        route = "/process_status?filename=somestringofcharactersthatsurelywontexist"
        response = await client.get(route)
        assert "Process does not exist" == (await response.get_data()).decode("utf-8")
        assert 404 == response.status_code

    @pytest.mark.asyncio
    async def test_process_status_process_found(self, app):
        filename = "yes.mp4"
        client = app.test_client()
        route = f"/process_status?filename={filename}"
        tracker = app.app.config["TRACKER"]
        tracker.add(filename, ProcessTrackerObject(mp.Process(target=demo_func)))
        tracker.get_process(filename).process.start()   # run function that sleeps for 1s

        # immediately check if function has finished
        response = await client.get(route)
        assert "False" == (await response.get_data()).decode("utf-8")
        assert 200 == response.status_code

        time.sleep(2)   # wait long enough that the function should finish/exit

        # recheck status now that function should have exited
        response = await client.get(route)
        assert "True" == (await response.get_data()).decode("utf-8")
        assert 200 == response.status_code

    @pytest.mark.asyncio
    async def test_process_status_method_not_allowed(self, app):
        client = app.test_client()
        route = "/process_status"
        for method in [client.put, client.post, client.delete, client.trace, client.patch]:
            response = await method(route)
            assert 405 == response.status_code

    @pytest.mark.asyncio
    async def test_cancel_process_process_not_found(self, app):
        client = app.test_client()
        route = "/cancel_process"
        filename = "somestringofcharactersthatsurelywontexist"
        response = await client.post(route, data=filename)
        assert "Process does not exist in the current runtime" == (await response.get_data()).decode("utf-8")
        assert 404 == response.status_code

    @pytest.mark.asyncio
    async def test_cancel_process_process_found(self, app):
        client = app.test_client()
        route = "/cancel_process"
        tracker = app.app.config["TRACKER"]
        tracker.add("yes.mp4", ProcessTrackerObject(mp.Process(target=demo_func)))
        tracker.get_process("yes.mp4").process.start()
        response = await client.post(route, data="yes.mp4")
        assert "Success" == (await response.get_data()).decode("utf-8")
        assert 200 == response.status_code

    @pytest.mark.asyncio
    async def test_cancel_process_method_not_allowed(self, app):
        client = app.test_client()
        route = "/cancel_process"
        for method in [client.put, client.get, client.delete, client.trace, client.patch]:
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
