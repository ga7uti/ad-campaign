"use client";
import { campaignClient } from '@/lib/campaign-client';
import { Box, Button, Card, CardContent, FormControl, Grid, TextField, Radio, RadioGroup, FormControlLabel, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Upload } from '@phosphor-icons/react';
import * as React from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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

  const [images, setImages] = React.useState<number[]>([]);
  const [logos, setLogos] = React.useState<number[]>([]);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isImageClicked, setImageClicked] = React.useState<boolean>(false);
  const [isLogoClicked, setLogoClicked] = React.useState<boolean>(false);
  const [isLogoUploadSuccess, setLogoUpload] = React.useState<boolean>(false);
  const [isImageUploadSuccess, setImageUpload] = React.useState<boolean>(false);
  
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [field]: field === "target_optimize" 
        ? event.target.value === "true" 
        : event.target.value,
    });
  };

  const handleSubmit = () => {
    console.log(formValues,images,logos)
  };
  
  const uploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setField: React.Dispatch<React.SetStateAction<number[]>>,
    fileType:string
  ) => {
    setIsPending(true);
    const files = event.target.files;
    if (files) {
      const ids = await campaignClient.uploadLogo(files,fileType)
      setField((prev) => [...prev, ...[ids]]);
    }
    setIsPending(false);
    fileType == "image"?setImageClicked(false):setLogoClicked(false);
  };

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
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Grid>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<Upload />}
                >
                    {isPending && isLogoClicked? 'Uploading...' : 'Upload Logo'}
                    <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => uploadFile(e,setLogos,'logo')}
                    onClick={()=> setLogoClicked(true)}
                  multiple
                  />
                </Button>
                {isLogoUploadSuccess && (
                  <Typography variant="body2" color="green" mt={2}>
                    Logo uploaded successfully!
                  </Typography>
                )}
                {/* {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}   */}
              </Grid>
            </Box>
              
          </Grid> 
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Grid>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<Upload />}
                  >
                    {isPending && isImageClicked ? 'Uploading...' : 'Upload Image'}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => uploadFile(e, setImages,'image')}
                      onClick={()=> setImageClicked(true)}
                    multiple
                    />
                  </Button>
                  {isImageUploadSuccess && (
                    <Typography variant="body2" color="green" mt={2}>
                      Logo uploaded successfully!
                    </Typography>
                  )}
                  {/* {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}   */}
                </Grid>
              </Box>
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