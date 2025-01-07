/* eslint-disable -- Disabling all Eslint rules for the file*/
"use client";
import { campaignClient } from '@/lib/campaign-client';
import { Box, Button, Card, CardContent, FormControl, Grid, TextField, Radio, RadioGroup, FormControlLabel, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CaretUp, Upload } from '@phosphor-icons/react';
import { CaretDown } from '@phosphor-icons/react/dist/ssr';
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
  const [showTargetingType, setShowTargetingType] = React.useState<boolean>(true);
  const [showUploadSection, setShowUploadSection] = React.useState<boolean>(false);
  const [showLocationDeviceSection, setShowLocationDeviceSection] = React.useState<boolean>(false);
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
      {/* Main Form Fields
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
      </Grid> */}

      {/* Targeting Type Card */}
      <Card>
        <CardContent>
        <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Targeting Type</Typography>
                <Button
                  variant="text"
                  onClick={() => setShowTargetingType((prev) => !prev)}
                  startIcon={showTargetingType?<CaretUp/>: <CaretDown/>}
                />
              </Box>
              {showTargetingType && (
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="input-age"
                      placeholder="Enter age range"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="input-location"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                    >
                      <option value="">Select Location</option>
                      <option value="location1">Location 1</option>
                      <option value="location2">Location 2</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="input-device"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                    >
                      <option value="">Select Device</option>
                      <option value="device1">Device 1</option>
                      <option value="device2">Device 2</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="input-environment"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                    >
                      <option value="">Select Environment</option>
                      <option value="environment1">Environment 1</option>
                      <option value="environment2">Environment 2</option>
                    </TextField>
                  </Grid>
                </Grid>
              )}
          </FormControl>
        </CardContent>
      </Card>

      {/* Targeting Type Card */}
      <Card>
        <CardContent>
        <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Location & Device</Typography>
                <Button
                  variant="text"
                  onClick={() => setShowLocationDeviceSection((prev) => !prev)}
                  startIcon={showLocationDeviceSection?<CaretUp/>: <CaretDown/>}
                />
              </Box>
              {showLocationDeviceSection && (
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="input-location"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                    >
                      <option value="">Select Language</option>
                      <option value="location1">Language 1</option>
                      <option value="location2">Language 2</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="input-device"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                    >
                      <option value="">Select Carrier</option>
                      <option value="device1">Jio</option>
                      <option value="device2">Airtel</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="input-environment"
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                    >
                      <option value="">Select Device Price</option>
                      <option value="environment1">Less thank 10K</option>
                      <option value="environment2">10-15K</option>
                    </TextField>
                  </Grid>
                </Grid>
              )}
          </FormControl>
        </CardContent>
      </Card>

      {/* Upload Documents */}
      <Card>
        <CardContent>
        <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Upload Documents</Typography>
                <Button
                  variant="text"
                  onClick={() => setShowUploadSection((prev) => !prev)}
                  startIcon={showUploadSection?<CaretUp/>: <CaretDown/>}
                />
              </Box>
              {showUploadSection && (
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
              )}
          </FormControl>
        </CardContent>
      </Card>


      
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Campaign
        </Button>
      </Box>
    </Box>
  );
}