/* eslint-disable -- Disabling all Eslint rules for the file*/
"use client";
import { campaignClient } from '@/lib/campaign-client';
import { Location } from '@/types/location';
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
    age: "",
    device: "",
    environment:"",
    startTime:"",
    endTime:"",
    location:""
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
  const [location,setLocation]=React.useState<Location[]>([])
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [field]:event.target.value
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

  const fetchLocations = async () => {
    try {
      const locations = await campaignClient.getLocations();
      setLocation(locations)
    } catch (error) {
      console.error("Failed to fetch locations", error);
    }
  };

  React.useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

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
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                      value={formValues.age}
                      onChange={handleChange("age")}
                    >
                      <option value="">Select Age Range</option>
                      <option value="25">25</option>
                      <option value="26-35">26-35</option>
                      <option value="36-45">36-45</option>
                      <option value="46-55">46-55</option>
                      <option value="56-65">56-65</option>
                      <option value="65+">65+</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                      value={formValues.device}
                      onChange={handleChange("device")}
                    >
                      <option value="">Select Device</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Tablet">Tablet</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                      value={formValues.environment}
                      onChange={handleChange("environment")}
                    >
                      <option value="">Select Environment</option>
                      <option value="App">App</option>
                      <option value="Web">Web</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      fullWidth
                      value={formValues.location}
                      onChange={handleChange("location")}
                    >
                      <option value="">Select Location</option>
                      {location.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.city}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Start Time"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }} // 5 min
                      fullWidth
                      value={formValues.startTime}
                      onChange={handleChange("startTime")}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                        label="End Time"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }} // 5 min
                        fullWidth
                        value={formValues.endTime}
                        onChange={handleChange("endTime")}
                      />
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