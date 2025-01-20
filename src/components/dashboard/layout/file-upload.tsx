import { campaignClient } from "@/lib/campaign-client";
import { Alert, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { UploadSimple } from "@phosphor-icons/react";
import React, { useState } from "react";

interface FileUploadProps {
  fileType: string
  placeholder: string; 
  onUploadComplete: (response: any) => void; // Callback to send the response back to the parent
}

export default function FileUpload({ placeholder, onUploadComplete,fileType }: FileUploadProps): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file:File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      console.log("File",file)
      const id = await campaignClient.uploadFile(file,fileType);
      setUploadSuccess(true)
      onUploadComplete([id]);
    } catch (error:any) {
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
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*" // Adjust accept types as needed
          />
          <Button
            component="span"
            sx={{ color: "primary.main", paddingLeft: 2 }}
            onClick={() => document.querySelector('input[type="file"]')?.click()}
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

        {uploadSuccess && (
          <Box sx={{ marginTop: 2 }}>
           <Alert color="success">Uploaded {file?.name}</Alert>
          </Box>
        )}
    </Grid>
  );
};