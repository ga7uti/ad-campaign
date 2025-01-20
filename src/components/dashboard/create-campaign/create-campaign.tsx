"use client"
import { campaignClient } from '@/lib/campaign-client';
import { CommonSelectResponse, Location } from '@/types/campaign';
import { CampaignFormSchema, FormData } from '@/types/create-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from '../layout/file-upload';
import FormField from '../layout/form-field';

export default function CreateCampaign(): React.JSX.Element {
    const [ages, setAge] = React.useState<CommonSelectResponse[]>([]);
    const [devices, setDevices] = React.useState<CommonSelectResponse[]>([]);
    const [environment, setEnvironment] = React.useState<CommonSelectResponse[]>([]);
    const [location, setLocation] = React.useState<Location[]>([]);
    const [formData, setFormData] = React.useState<FormData>();

    const {
      register,
      setValue,
      setError,
      clearErrors,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(CampaignFormSchema) });
  
    const onSubmit = async (data: FormData) => {
      if (!data.image || data.image.length === 0) {
        setError("image", { message: "Image is required" });
      } else {
        clearErrors();
        setFormData(data);
      }
    };
  
    const fetchData = async () => {
      try {
        const [ageRes, deviceRes, envRes, locRes] = await Promise.all([
          campaignClient.getAge(),
          campaignClient.getDevice(),
          campaignClient.getEnv(),
          campaignClient.getLocations(),
        ]);
        setAge(ageRes);
        setDevices(deviceRes);
        setEnvironment(envRes);
        setLocation(locRes);
      } catch (error) {
        console.error("Failed to load campaign data", error);
      }
    };
  
    React.useEffect(() => {
      fetchData();
    }, []);
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Campaign Details Section */}
          <CardSection title="Campaign Details">
            <Grid container spacing={2} mt={2}>
                {/* Name */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Name"
                        name="name"
                        register={register}
                        error={errors.name}
                        data={undefined}
                    />
                    </Box>
                </Grid>

                {/* Age */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Age Range"
                        name="age"
                        register={register}
                        error={errors.age}
                        data={ages}
                    />
                    </Box>
                </Grid>


                {/* Device */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Devices"
                        name="device"
                        register={register}
                        error={errors.device}
                        data={devices}
                    />
                    </Box>
                </Grid>

                {/* Environment */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Environments"
                        name="environment"
                        register={register}
                        error={errors.environment}
                        data={environment}
                    />
                    </Box>
                </Grid>

                {/* Location */}
                <Grid item xs={12} md={6} mb={1}>
                    <Box sx={{ minWidth: 120 }}>
                    <FormField
                        type="text"
                        placeholder="Locations"
                        name="location"
                        register={register}
                        error={errors.location}
                        data={location}
                    />
                    </Box>
                </Grid>
            </Grid>
          </CardSection>
  
        {/* Campaign Details Section */}
        <CardSection title="File Upload">
            <Grid container spacing={2} mt={2}>
                {/* Image Upload */}
                <Grid item xs={12} md={6} lg={4} mb={1}>
                <FileUpload
                  name="image"
                  register={register}
                  setValue={setValue} // Pass setValue here
                  placeholder="Select Campaign Image"
                  fileType="image"
                />
                {errors.image && 
                  <Typography sx={{ color: 'gray', fontSize: '0.75rem' }}>
                    {errors.image?.message}
                  </Typography>
                }
                </Grid>
            </Grid>
          </CardSection>
  
          {/* Submit Button */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </Box>
        <Typography>{JSON.stringify(formData)}</Typography>
      </form>
    );
  }
  
  // CardSection Component
  function CardSection({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }): React.JSX.Element {
    const [expanded, setExpanded] = React.useState<boolean>(true);
  
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{title}</Typography>
            <Button
              variant="text"
              onClick={() => setExpanded((prev) => !prev)}
              startIcon={expanded ? <CaretUp /> : <CaretDown />}
            />
          </Box>
          {expanded && <Box sx={{ mt: 2 }}>{children}</Box>}
        </CardContent>
      </Card>
    );
  }
  