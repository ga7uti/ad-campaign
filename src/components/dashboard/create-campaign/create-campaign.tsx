/* eslint-disable -- Disabling all Eslint rules for the file*/
"use client";
import { campaignClient } from '@/lib/campaign-client';
import { Age, Interest, Location, Partners } from '@/types/campaign';
import { Box, Button, Card, CardContent, FormControl, Grid, TextField, Radio, RadioGroup, FormControlLabel, Typography, Divider, InputLabel, Select, MenuItem, SelectChangeEvent, DialogActions, Dialog, DialogTitle, DialogContent } from '@mui/material';
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreateCampaign(): React.JSX.Element {
  const [formValues, setFormValues] = React.useState({
    name:"",
    age: [],
    device: [],
    environment:[],
    startTime:"",
    endTime:"",
    location:[],
    partner:[],
    interest:[],
    selectedInterest:[]
  });

  const [images, setImages] = React.useState<number[]>([]);
  const [logos, setLogos] = React.useState<number[]>([]);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [showTargetingType, setShowTargetingType] = React.useState<boolean>(true);
  const [showUploadSection, setShowUploadSection] = React.useState<boolean>(true);
  const [showExhangeSection, setShowExhangeSection] = React.useState<boolean>(true);
  const [showAudienceSection, setShowAudienceSection] = React.useState<boolean>(true);
  const [isImageClicked, setImageClicked] = React.useState<boolean>(false);
  const [isLogoClicked, setLogoClicked] = React.useState<boolean>(false);
  const [isLogoUploadSuccess, setLogoUpload] = React.useState<boolean>(false);
  const [isImageUploadSuccess, setImageUpload] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [location,setLocation]=React.useState<Location[]>([])
  const [partners,setPartners]=React.useState<Partners[]>([])
  const [ages,setAge]=React.useState<Age[]>([])
  const [interests,setInterest]=React.useState<string[]>([])
  const [selectedInterests,setSelectedInterest]=React.useState<Interest[]>([])
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [field]:event.target.value
    });
  };

  const onSelectedChange = (field: string) => (event: SelectChangeEvent) => {
    setFormValues({
      ...formValues,
      [field]:event.target.value
    });
    if(field === "interest"){
      setSelectedInterest(campaignClient.getSelectedInterest(formValues.interest))
    }
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
  
  const fetchPartners = async () => {
    try {
      const partners = await campaignClient.getAdPartners();
      setPartners(partners)
    } catch (error) {
      console.error("Failed to fetch partners", error);
    }
  };

  const fetchAges = async () => {
    try {
      const ages = await campaignClient.getAge();
      setAge(ages)
    } catch (error) {
      console.error("Failed to fetch partners", error);
    }
  };

  const fetchDistinctInterest = ()=>{
    const interest = campaignClient.getDistinctInterest();
    setInterest(interest);
  }
  React.useEffect(() => {
    fetchLocations();
    fetchPartners();
    fetchAges();
    fetchDistinctInterest();
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
                  {/* Name */}
                  <Grid item xs={12} md={6} mb={2}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="Name"
                            value={formValues.name}
                            onChange={handleChange("name")}
                          />
                        </FormControl>
                      </Box>
                  </Grid>
                  {/* Age */}
                  <Grid item xs={12} md={6} mb={2}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel>Age</InputLabel>
                      <Select
                        fullWidth
                        value={formValues.age}
                        label="Age"
                        onChange={onSelectedChange("age")}
                        multiple
                        MenuProps={MenuProps}
                        >
                        {ages.map((age) => (
                            <MenuItem value={age.range}>{age.range}</MenuItem>
                          ))}
                      </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  {/* Device */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>Device</InputLabel>
                        <Select
                          fullWidth
                          value={formValues.device}
                          label="Age"
                          onChange={onSelectedChange("device")}
                          multiple
                          MenuProps={MenuProps}
                          >
                          <MenuItem value={"Desktop"}>Desktop</MenuItem>
                          <MenuItem value={"Mobile"}>Mobile</MenuItem>
                          <MenuItem value={"Tablet"}>Tablet</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  {/* Environment */}
                  <Grid item xs={12} md={6} mb={2}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>Environment</InputLabel>
                        <Select
                          fullWidth
                          value={formValues.environment}
                          label="Age"
                          onChange={onSelectedChange("environment")}
                          multiple
                          MenuProps={MenuProps}
                          >
                          <MenuItem value={"App"}>App</MenuItem>
                          <MenuItem value={"Web"}>Web</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  {/* Time Range */}
                  <Grid item xs={12} md={6} mb={2}>
                      <Button variant="outlined" fullWidth size="large" onClick={handleClickOpen}>Select Time Range</Button>
                      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                        <DialogTitle>Fill the form</DialogTitle>
                        <DialogContent>
                          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                              <TextField
                                label="Start Time"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 300 }} // 5 min
                                fullWidth
                                value={formValues.startTime}
                                onChange={handleChange("startTime")}
                              />
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                              <TextField
                                label="End Time"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 300 }} // 5 min
                                fullWidth
                                value={formValues.endTime}
                                onChange={handleChange("endTime")}
                              />
                            </FormControl>
                          </Box>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                      </Dialog>                   
                  </Grid>
                  {/* Location */}
                  <Grid item xs={12} md={6} mb={2}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>Location</InputLabel>
                        <Select
                          fullWidth
                          value={formValues.location}
                          label="Age"
                          onChange={onSelectedChange("location")}
                          multiple
                          MenuProps={MenuProps}
                          >
                          {location.map((loc) => (
                            <MenuItem value={loc.id}>{loc.city}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              )}
          </FormControl>
        </CardContent>
      </Card>

      {/* Exhange */}
      <Card>
        <CardContent>
        <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Exchange</Typography>
                <Button
                  variant="text"
                  onClick={() => setShowExhangeSection((prev) => !prev)}
                  startIcon={showExhangeSection?<CaretUp/>: <CaretDown/>}
                />
              </Box>
              {showExhangeSection && (
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>Exchange</InputLabel>
                        <Select
                          fullWidth
                          value={formValues.partner}
                          onChange={onSelectedChange("partner")}
                          multiple
                          MenuProps={MenuProps}
                          >
                          {partners.map((par) => (
                            <MenuItem value={par.id}>{par.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              )}
          </FormControl>
        </CardContent>
      </Card>

      {/* Audience */}
      <Card>
        <CardContent>
        <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Category</Typography>
                <Button
                  variant="text"
                  onClick={() => setShowAudienceSection((prev) => !prev)}
                  startIcon={showAudienceSection?<CaretUp/>: <CaretDown/>}
                />
              </Box>
              {showAudienceSection && (
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          fullWidth
                          value={formValues.interest}
                          label="Age"
                          onChange={onSelectedChange("interest")}
                          multiple
                          MenuProps={MenuProps}
                          >
                          {interests.map((interest) => (
                            <MenuItem value={interest}>{interest}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel>SubCategory</InputLabel>
                        <Select
                          fullWidth
                          value={formValues.selectedInterest}
                          label="Age"
                          onChange={onSelectedChange("selectedInterest")}
                          multiple
                          MenuProps={MenuProps}
                          >
                          {selectedInterests.map((selectedInterest) => (
                            <MenuItem value={selectedInterest.id}>{selectedInterest.subcategory}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
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

        <Typography>{JSON.stringify(formValues)}</Typography>
      </Box>
    </Box>
  );
}