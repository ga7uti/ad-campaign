"use client"
import { campaignClient } from '@/lib/campaign-client';
import { CommonSelectResponse, Location } from '@/types/campaign';
import { CampaignFormSchema, FormData } from '@/types/create-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../layout/form-field';

export default function CreateCampaign(): React.JSX.Element {
    const [showTargetingType, setShowTargetingType] = React.useState<boolean>(true);
    const [ages,setAge]=React.useState<CommonSelectResponse[]>([])
    const [devices,setDevices]=React.useState<CommonSelectResponse[]>([])
    const [environment,setEnvrionment]=React.useState<CommonSelectResponse[]>([])
    const [location,setLocation]=React.useState<Location[]>([])
    const [formData,setFormData]=React.useState<FormData>()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
      } = useForm<FormData>({ resolver: zodResolver(CampaignFormSchema)});
    
      const onSubmit = async (data: FormData) => {
        setFormData(data)
      }

    const fetchAgeRange = async () => {
        try {
            const response = await campaignClient.getAge();
            setAge(response)
            } catch (error) {
            console.error("Failed to load age", error);
        }
    };

    const fetchDevice = async () => {
        try {
            const response = await campaignClient.getDevice();
            setDevices(response)
            } catch (error) {
            console.error("Failed to load device", error);
        }
    };
    
    const fetchEnv = async () => {
        try {
            const response = await campaignClient.getEnv();
            setEnvrionment(response)
            } catch (error) {
            console.error("Failed to load device", error);
        }
    };

    const fetchLocation = async () => {
        try {
            const response = await campaignClient.getLocations();
            setLocation(response)
            } catch (error) {
            console.error("Failed to load device", error);
        }
    };

    React.useEffect(()=>{
        fetchAgeRange();
        fetchDevice();
        fetchEnv();
        fetchLocation();
    },[])
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Targeting Type Card */}
                <Card>
                    <CardContent>
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
                                    <Grid item xs={12} md={6} mb={1}>
                                        <Box sx={{ minWidth: 120 }}>
                                        <FormField
                                            type="text"
                                            placeholder="Enter campaign name"
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
                                            placeholder="Select age range"
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
                                            placeholder="Select age range"
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
                                            placeholder="Select environment"
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
                                            placeholder="Select location"
                                            name="location"
                                            register={register}
                                            error={errors.location}
                                            data={location}
                                        />
                                        </Box>
                                    </Grid>

                                </Grid>
                                
                            )}
                    </CardContent>
                </Card>
                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button variant="contained" color="primary" type="submit">Submit</Button>
                </Box>
            </Box>
            <Typography>{JSON.stringify(formData)}</Typography>

        </form>
    );
}