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
  const [ages, setAge] = React.useState<CommonSelectResponse[]>([]);
  const [devices, setDevices] = React.useState<CommonSelectResponse[]>([]);
  const [environment, setEnvironment] = React.useState<CommonSelectResponse[]>([]);
  const [location, setLocation] = React.useState<Location[]>([]);
  const [formData, setFormData] = React.useState<FormData>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(CampaignFormSchema) });

  const onSubmit = async (data: FormData) => {
    setFormData(data);
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
        {/* Campaign Name Section */}
        <CardSection title="Campaign Name">
          <FormField
            type="text"
            placeholder="Campaign name"
            name="name"
            register={register}
            error={errors.name}
            data={undefined}
          />
        </CardSection>

        {/* Age Section */}
        <CardSection title="Age Range">
          <FormField
            type="text"
            placeholder="Age Range"
            name="age"
            register={register}
            error={errors.age}
            data={ages.length > 0 ? ages : [{ id: 0, value: "No data available" }]}
          />
        </CardSection>

        {/* Device Section */}
        <CardSection title="Devices">
          <FormField
            type="text"
            placeholder="Devices"
            name="device"
            register={register}
            error={errors.device}
            data={devices.length > 0 ? devices : [{ id: 0, value: "No data available" }]}
          />
        </CardSection>

        {/* Environment Section */}
        <CardSection title="Environment">
          <FormField
            type="text"
            placeholder="Environments"
            name="environment"
            register={register}
            error={errors.environment}
            data={environment.length > 0 ? environment : [{ id: 0, value: "No data available" }]}
          />
        </CardSection>

        {/* Location Section */}
        <CardSection title="Locations">
          <FormField
            type="text"
            placeholder="Locations"
            name="location"
            register={register}
            error={errors.location}
            data={location.length > 0 ? location : [{ id: 0, city: "No data available" }]}
          />
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
