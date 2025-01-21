/* eslint-disable -- Disabling all Eslint rules for the file*/

import { campaignClient } from "@/lib/campaign-client";
import { FileUploadProps } from "@/types/form-data";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";

export default function FileUpload({
  name,
  placeholder,
  register,
  setValue,
}: FileUploadProps): React.JSX.Element {

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files) {
      const selectedFile = e.target.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf']; // Add more types as needed
      if (!allowedTypes.includes(selectedFile.type)) {
          setError("Invalid file type. Only PNG, JPEG, and PDF are allowed.");
          return;
        }
        setFile(selectedFile);
        handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile:File) => {
    if (!selectedFile) return;
    setUploading(true);
    setError("");
    try {
      const id = await campaignClient.uploadFile(selectedFile, name.toString()); // Upload the file
      setUploadSuccess(true);
      setValue(name, [id]); // Update form state with the uploaded file's ID
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      {!uploadSuccess && !uploading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "2px dashed",
              borderColor: "primary.main", // Primary color for the dotted border
              borderRadius: "8px",
              cursor: "pointer",
              transition: "border-color 0.3s ease",
              "&:hover": {
                borderColor: "primary.dark", // Change border color on hover
              },
            }}
          >
            {/* Hidden file input */}
            <input
              className={name}
              {...register(name)} // Register the input with React Hook Form
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              component="span"
              fullWidth
              sx={{ color: "primary.main", paddingLeft: 2 }}
              onClick={() => (document.querySelector(`input[type="file"].${name}`) as HTMLInputElement).click()}
            >
              {placeholder}
            </Button>
          </Box>
      )}

      {uploading && (
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box sx={{ marginLeft: 2 }}>
              <CircularProgress />
            </Box>
          </Box>
      )}

      {/* Display error if any */}
      {error && (
        <Box sx={{ marginTop: 2 }}>
          <Alert color="error">{error}</Alert>
        </Box>
      )}

      {/* Display success message after upload */}
      {uploadSuccess && (
        <Box sx={{ marginTop: 2 }}>
          <Alert color="success">Uploaded {file?.name}</Alert>
        </Box>
      )}
    </Box>
  );
}
