import "./page.css";
import { VideoUI } from "@components/UploadVideoForm";
import { Text, TextContent, TextVariants } from "@patternfly/react-core";

export function VideoUpload() {
	return (
		<main className="main">
			<div className="title">
				<h1>Upload a video!</h1>
			</div>
			<VideoUI />
		</main>
	);
}
export default VideoUpload;
