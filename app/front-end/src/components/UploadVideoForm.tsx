"use client";
import { useState } from "react";
import { JSONResponse } from "@lib/json";
import {
	Button,
	DropEvent,
	FileUpload,
	Stack,
	StackItem,
	Grid,
	GridItem,
} from "@patternfly/react-core";

export const UploadVideoForm = () => {
	const [file, setFile] = useState<File>();
	const [filename, setFilename] = useState<string>("");
	const [isPicked, setIsPicked] = useState<boolean>(false);
	const [responseData, setResponseData] = useState<JSONResponse>();

	const onSubmitClick = async (e: any) => {
		if (!file || !isPicked) {
			alert("No file selected!");
			return;
		}

		setResponseData(undefined);

		try {
			const formData = new FormData();
			formData.set("file", file);

			const response = await fetch("/api/video/upload", {
				method: "POST",
				body: formData,
			});

			const json = await response.clone().json();

			if (!response.ok) {
				console.error("Error in upload response.");
				throw Error(await response.text());
			}

			setResponseData(json);
			if (json["data"]["success"]) {
				// we've received a success code from the API route
				// send request to python server
			}
		} catch (err: any) {
			console.error(err.message);
		}
	};

	return (
		<Stack>
			<StackItem>
				<FileUpload
					id="videoupload"
					filename={filename}
					onFileInputChange={(e: DropEvent, f: File) => {
						setFile(f);
						setIsPicked(true);
						setFilename(f.name);
					}}
					onClearClick={() => {
						// setFile(undefined);
						setFilename("");
						setIsPicked(false);
					}}
					dropzoneProps={{
						accept: {
							"video/mp4": [".mp4"],
							"video/x-msvideo": [".avi"],
							"video/quicktime": [".mov"],
						},
						onDropRejected: (
							fileRejectionList,
							event: DropEvent
						) => {
							alert(
								"Invalid file type! Must be a *.mp4, *.avi, or *.mov file."
							);
							// setFile(undefined);
							setFilename("");
							setIsPicked(false);
						},
					}}
				/>
			</StackItem>
			<StackItem>
				<Grid>
					<GridItem span={4}></GridItem>
					<GridItem span={4}>
						<Button
							variant="danger"
							onClick={(e) => {
								alert("Not implemented yet!");
							}}
						>
							Record video
						</Button>
					</GridItem>
					<GridItem span={4}>
						<Button variant="primary" onClick={onSubmitClick}>
							Submit video
						</Button>
					</GridItem>
				</Grid>
			</StackItem>
		</Stack>
	);
};
export default UploadVideoForm;
