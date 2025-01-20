import { campaignClient } from "@/lib/campaign-client";
import { Alert, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { UploadSimple } from "@phosphor-icons/react";
import React, { useState } from "react";

interface FileUploadProps {
  fileType: string
  placeholder: string; 
  onUploadComplete: (response: any) => void; // Callback to send the response back to the parent
}

export default function FileUpload({ placeholder, onUploadComplete }: FileUploadProps): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      console.log("File",file)
      const id = await campaignClient.uploadFile(file,"image");
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
        {/* Upload Button and Progress */}
        {file && !uploading && (
          <Box sx={{ marginLeft: 2 }}>
            <Button onClick={handleUpload} startIcon={<UploadSimple fontSize="var(--icon-fontSize-md)" />} variant="contained">Upload</Button>
          </Box>
        )}

        {uploading && (
          <Box sx={{ marginLeft: 2 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              Uploading...
            </Typography>
          </Box>
        )}
      </Grid>
       {/* Display error if any */}
       {error && (
          <Box sx={{ marginTop: 2 }}>
           <Alert color="error">{error}</Alert>
          </Box>
        )}
    </Grid>
  );
};