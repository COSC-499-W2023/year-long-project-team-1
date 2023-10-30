import "./page.css"
import { UploadVideoForm } from "@components/UploadVideoForm";

export default function Page() {
	return (
		<main className="main">
			<div className="title">
				<h1>Upload a video!</h1>
			</div>
			<UploadVideoForm />
		</main>
	);
}
