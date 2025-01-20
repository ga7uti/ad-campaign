import { campaignClient } from "@/lib/campaign-client";
import { FormData, ValidFieldNames } from "@/types/create-form";
import { Alert, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface FileUploadProps {
  name: ValidFieldNames;
  fileType: string;
  placeholder: string;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>; // Add setValue to update form state
}

export default function FileUpload({
  name,
  placeholder,
  fileType,
  register,
  setValue,
}: FileUploadProps): React.JSX.Element {

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>(""); // Local error state
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const id = await campaignClient.uploadFile(file, fileType); // Upload the file
      setUploadSuccess(true);
      setValue(name, [id]); // Update form state with the uploaded file's ID
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      {/* File Select Input */}
      <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" alignItems="center">
        {/* Dotted Border Select Box */}
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
            {...register(name)} // Register the input with React Hook Form
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*" // Accept only image files
          />
          <Button
            component="span"
            sx={{ color: "primary.main", paddingLeft: 2 }}
            onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement).click()}
          >
            {placeholder}
          </Button>
        </Box>
      </Grid>

      {/* Upload Icon Section */}
      <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" alignItems="center">
        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ marginLeft: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Grid>

      {uploading && (
        <Box sx={{ marginLeft: 2 }}>
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            Uploading... {file?.name}
          </Typography>
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
          <Alert color="success">Uploaded</Alert>
        </Box>
      )}
    </Grid>
  );
}
