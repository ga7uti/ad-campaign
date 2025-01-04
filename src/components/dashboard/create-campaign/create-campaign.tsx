"use client";
import { Box, Button, Card, CardContent, FormControl, Grid, TextField, Radio, RadioGroup, FormControlLabel, Typography } from '@mui/material';
import * as React from 'react';

export default function CreateCampaign(): React.JSX.Element {
  const [formValues, setFormValues] = React.useState({
    final_url: "",
    business_name: "",
    campaign_type: "",
    text: "",
    geo_location: "",
    budget: "",
    language: "",
    bidding: "",
    bidding_focus: "",
    target_people: "",
    target_content: "",
    target_optimize: false,
  });

  // const [images, setImages] = React.useState<number[]>([]);
  // const [logos, setLogos] = React.useState<number[]>([]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [field]: field === "target_optimize" 
        ? event.target.value === "true" 
        : event.target.value,
    });
  };

  // const handleFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   setField: React.Dispatch<React.SetStateAction<number[]>>
  // ) => {
  //   const files = event.target.files;
  //   if (files) {
  //     const ids = await Promise.all(
  //       Array.from(files).map((file) => mockApiCall(file))
  //     );
  //     setField((prev) => [...prev, ...ids]);
  //     console.log("Uploaded File IDs:", ids);
  //   }
  // };

  // const mockApiCall = async (file: File): Promise<number> => {
  //   return new Promise((resolve) => setTimeout(() => resolve(Math.floor(Math.random() * 1000)), 1000));
  // };

  const handleSubmit = (): { formValues: typeof formValues; images?: number[]; logos?: number[] } => {
    return {
      formValues,
      // images,
      // logos,
    };
  };
  
  // Call the function and log the result
  // const result = handleSubmit();
  // console.log("Result from handleSubmit:", result);

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Main Form Fields */}
      <Grid container spacing={2}>
        {Object.keys(formValues).map((field) =>
          field !== "target_optimize" ? (
            <Grid item xs={12} md={6} key={field}>
              <Card>
                <CardContent>
                  <FormControl fullWidth>
                    <TextField
                      id={`input-${field}`}
                      label={field.replace(/_/g, " ").toUpperCase()}
                      placeholder="Enter this field details"
                      variant="outlined"
                      value={formValues[field as keyof typeof formValues]}
                      onChange={handleChange(field as keyof typeof formValues)} 
                      type="text"
                    />
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12} md={6} key={field}>
              <Card>
                <CardContent>
                  <FormControl component="fieldset">
                    <Typography>{field.replace(/_/g, " ").toUpperCase()}</Typography>
                    <RadioGroup
                      row
                      value={formValues[field].toString()}
                      onChange={handleChange(field)}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      {/* File Upload image and logo */}
      <Box>
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          File Upload Section
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Upload Images</Typography>
            <input
              type="file"
              multiple
              // onChange={(e) => handleFileChange(e, setImages)}
              style={{ marginTop: "8px" }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {/* Uploaded Image IDs: {images.join(", ")} */}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Upload Logos</Typography>
            <input
              type="file"
              multiple
              // onChange={(e) => handleFileChange(e, setLogos)}
              style={{ marginTop: "8px" }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {/* Uploaded Logo IDs: {logos.join(", ")} */}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Campaign
        </Button>
      </Box>
    </Box>
  );
}