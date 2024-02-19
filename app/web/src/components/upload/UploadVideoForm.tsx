/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use client";
import { useState } from "react";
import { JSONResponse } from "@lib/response";
import {
  Button,
  Stack,
  StackItem,
  Grid,
  GridItem,
  Card,
  CardTitle,
  CardBody,
  ActionList,
  ActionListItem,
  Form,
  Switch,
} from "@patternfly/react-core";
import { useRouter } from "next/navigation";
import style from "@assets/style";
import { encode } from "punycode";
import React from "react";

export const UploadVideoForm:React.FunctionComponent = () => {
  const router = useRouter();

  const [file, setFile] = useState<File>();
  const [filename, setFilename] = useState<string>("");
  const [isPicked, setIsPicked] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<JSONResponse>();
  const acceptedMimeTypes = ["video/mp4", "video/x-msvideo", "video/quicktime"]; // mp4, avi, mov
  
  const [blurFaceCheck, setBlurFacesCheck] = React.useState<boolean>(true);

  const handleChange = (_event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    setBlurFacesCheck(checked);
    console.log(checked.toString());
  };
  

  const onSubmitClick = async (e: any) => {
    if (!file || !isPicked) {
      alert("No file selected!");
      return;
    }

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("blurFaces", blurFaceCheck.toString());

      const response = await fetch("/api/video/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error in upload response.");
        throw Error(await response.text());
      } else if (response.status === 200) {
        const json = await response.clone().json();

        setResponseData(json);

        setTimeout(() => {
          router.push(
            `/upload/status/${encodeURIComponent(json.data?.filePath)}`,
          );
        }, 150);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const onFileChanged = (e: any) => {
    const f = e.target.files?.[0] as File;
    if (!acceptedMimeTypes.includes(f.type)) {
      alert("You must select an *.mp4, *.avi, or *.mov file");
      return;
    }
    setFile(f);
    setIsPicked(true);
    setFilename(f.name);
  };

  return (
    <Card style={style.card} aria-label="Video uploader">
      <CardTitle component="h1">Upload a Video</CardTitle>
      <CardBody>
        {responseData?.data?.success ? (
          <p className="success">Upload successful. Redirecting...</p>
        ) : (
          <Form
            aria-label="Video upload form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="file-input"
              type="file"
              alt="file upload"
              accept={acceptedMimeTypes.toString()}
              onChange={onFileChanged}
            />
            <ActionList style={style.actionList}>
              <ActionListItem>
                <Switch
                  id="simple-switch"
                  label="Face blurring on"
                  labelOff="Face blurring off"
                  isChecked={blurFaceCheck}
                  onChange={handleChange}
                  ouiaId="UploadVideoForm"
                />

              </ActionListItem>
              <ActionListItem>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={onSubmitClick}
                  aria-label="Submit video"
                >
                  Submit video
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button
                  variant="danger"
                  isDisabled={true}
                  aria-label="Record video"
                >
                  Record video
                </Button>
              </ActionListItem>
            </ActionList>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};
export default UploadVideoForm;
