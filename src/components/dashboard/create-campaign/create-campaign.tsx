"use client"
import { campaignClient } from '@/lib/campaign-client';
import { Age } from '@/types/campaign';
import { CampaignFormSchema } from '@/types/create-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FormField from './form-field';

export default function CreateCampaign(): React.JSX.Element {
    const [showTargetingType, setShowTargetingType] = React.useState<boolean>(true);
    const [ages,setAge]=React.useState<Age[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
      } = useForm<FormData>({ resolver: zodResolver(CampaignFormSchema)});
    
      const onSubmit = async (data: FormData) => {
          console.log("SUCCESS");
      }

    async function fetchAgeRange() {
        try {
            const response = await campaignClient.getAge();
            setAge(response);
        } catch (error:any) {
            console.log(error)
        }
    }  

    React.useEffect(()=>{
        fetchAgeRange();
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
                                    <Grid item xs={12} md={6} mb={2}>
                                        <Box sx={{ minWidth: 120 }}>
                                        <FormField
                                            type="text"
                                            placeholder="Enter campaign name"
                                            name="name"
                                            register={register}
                                            error={errors.name}
                                        />
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}
                    </CardContent>
                </Card>
                <Box sx={{ textAlign: "center", mt: 3 }}>
                <button type="submit" className="submit-button">Submit</button>
                </Box>
            </Box>
        </form>
    );
}