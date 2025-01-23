"use client"
import { campaignClient } from '@/lib/campaign-client';
import { utils } from '@/lib/common';
import { paths } from '@/paths';
import { CampaignFormData, CommonSelectResponse, ImpressionData, Interest, Location } from '@/types/campaign';
import { CampaignFormSchema } from '@/types/form-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, SelectChangeEvent, Typography } from '@mui/material';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from '../layout/file-upload';
import FormField from '../layout/form-field';
import { ImpressionChart } from './impression-chart';


export default function CreateCampaign(): React.JSX.Element {

    const router = useRouter();
    const [ages, setAge] = React.useState<CommonSelectResponse[]>([]);
    const [devices, setDevices] = React.useState<CommonSelectResponse[]>([]);
    const [environment, setEnvironment] = React.useState<CommonSelectResponse[]>([]);
    const [location, setLocation] = React.useState<Location[]>([]);
    const [exchange, setExchanges] = React.useState<CommonSelectResponse[]>([]);
    const [language, setLanguage] = React.useState<CommonSelectResponse[]>([]);
    const [carrier, setCarrier] = React.useState<CommonSelectResponse[]>([]);
    const [devicePrice, setDevicePrice] = React.useState<CommonSelectResponse[]>([]);
    const [distinctInterest, setDistinctInterest] = React.useState<CommonSelectResponse[]>([]);
    const [selectedInterest, setSelectedInterest] = React.useState<Interest[]>([]);
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [isCampaignCreated,setIsCampaignCreated] = React.useState<boolean>(false);
    const [impressionData,setImpressionData] = React.useState<ImpressionData>();
    const [totalPopulation,setTotalPopulation] = React.useState<number>(0);
    const [targetPopulation, setTargetPopulation] = React.useState<number>(0);
    const [previousName, setPreviousName] = React.useState<string>("");
    const [calPopulation, setCalPopulation] = React.useState <number>(0)

    const {
      register,
      setValue,
      setError,
      clearErrors,
      handleSubmit,
      formState: { errors },
    } = useForm<CampaignFormData>({ resolver: zodResolver(CampaignFormSchema) });
  
    const onSubmit = async (data: CampaignFormData) => {
      if (!data.images || data.images.length === 0) {
        setError('images',{message:"Image is required"});
        return;
      }
      clearErrors();
      createCampaign(data);
    };
  
    const fetchData = async () => {
      try {
        const [ageRes, deviceRes, envRes, locRes,exchangeRes,langRes,
          carrierRes,devicePriceRes, interestRes, impressionRes] = await Promise.all([
          campaignClient.getAge(),
          campaignClient.getDevice(),
          campaignClient.getEnv(),
          campaignClient.getLocations(),
          campaignClient.getExchange(),
          campaignClient.getLanguage(),
          campaignClient.getCarrier(),
          campaignClient.getDevicePrice(),
          campaignClient.getDistinctInterest(),
          campaignClient.getImpressionData(),
        ]);
        setAge(ageRes);
        setDevices(deviceRes);
        setEnvironment(envRes);
        setLocation(locRes);
        setExchanges(exchangeRes);
        setLanguage(langRes);
        setCarrier(carrierRes);
        setDevicePrice(devicePriceRes);
        setDistinctInterest(interestRes)
        setImpressionData(impressionRes)
        setTotalPopulation(impressionRes.totalPopulation)
      } catch (error) {
        setError('root', { type: 'server', message: "Failed to load campaign data. Error: " + error});
      }
    };
  
    const fetchSelectedInterest = async (interest: string) => {
      try {
        const result = await campaignClient.getSelectedInterest(interest);
        setSelectedInterest(result);
      } catch (error) {
        setError('root', { type: 'server', message: "Failed to fetch selected category. Error: " + error});
      }
    };

    const createCampaign = async(data:CampaignFormData) => {
      if(!data) 
        return;

      const errors = utils.validateMandatoryFields(data);
      if(errors && Object.keys(errors).length > 0){
        setError('root',{message:Object.values(errors)[0]});
        return
      }
      
      setIsPending(true);
      try {
        const result = await campaignClient.postCampaign(data);
        if (result) {
          setIsCampaignCreated(true);
          setTimeout(()=>{
            router.push(paths.dashboard.overview);
          },1000)
        }
      } catch (error:any) {
        setError('root', { type: 'server', message: error.message});
      } finally {
        setIsPending(false);
      }
    }

    const handleSelectChange = async (
      event: SelectChangeEvent<unknown>, // Use SelectChangeEvent here
      name: string
    ) => {

        let effectiveCalPopulation = calPopulation;
        if (previousName !== null && previousName !== name) {
          console.log("Previous Name "+ previousName+ "  Cal Population: " + calPopulation + " Target Population: "+ targetPopulation)
          setPreviousName(name);
          effectiveCalPopulation = targetPopulation;
          setCalPopulation(targetPopulation);
        }
        console.log("Effective Cal",effectiveCalPopulation)

      const selectedValue: string[] = event.target.value as string[];
      if (name === "distinct_interest") {
        try {
          await fetchSelectedInterest(selectedValue.join(","));
        } catch (error) {
          setError('root', { type: 'server', message: "Error fetching categories. Error: "+ error});
        }
      }

      // For age, device, carrier, environment
      if ((name === "age" || name === "device" || name === "carrier" || name === "environment")) {
        
          let totalPercentage = 0;
          selectedValue.forEach((value) => {
            const data =impressionData && impressionData[name] && 
              impressionData[name].find((item) => item.label.toLowerCase() === value.toLowerCase());
            if (data && data.percentage) {
              totalPercentage += data.percentage;
            }
          });

          // If no target population yet, use the total population
          const newTargetPopulation = targetPopulation === 0 
            ? Math.round((totalPopulation * totalPercentage) / 100)
            : Math.round((effectiveCalPopulation * totalPercentage) / 100);

          console.log(`After ${name} Target Population`, newTargetPopulation);
          setTargetPopulation(newTargetPopulation);
        }

        // For location selection: calculate the sum of the population of selected locations
        if (name === "location" && selectedValue.length > 0) {
          let newTargetPopulation = 0;
          selectedValue.forEach((data) => {
            const locationData = location.find((loc) => loc.id === parseInt(data));
            if (locationData) {
              newTargetPopulation += Number(locationData.population);
            }
          });

          // Update the target population after location selection
          console.log("New Target Population after location selection:", newTargetPopulation);
          setTargetPopulation(newTargetPopulation);
        }
      };

    React.useEffect(() => {
      fetchData();
    }, [selectedInterest,targetPopulation,calPopulation]);
  
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          
        }}
      >
        <Box sx={{ flex: 2 }} >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", 
                flexDirection: "column",
                gap: 3 ,
                border: 1,
                padding:2 ,
                borderColor: "grey.300",
            }}>
              {/* Campaign Details Section */}
              <CardSection title="Campaign Details" defaultExpanded={true}>
                {/* Name */}
                <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Name"
                        name="name"
                        register={register}
                        error={errors.name}
                        data={undefined}
                    />
                </Box>
                {/* Location */}
                <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Locations"
                        name="location"
                        register={register}
                        onChange={handleSelectChange}
                        error={Array.isArray(errors.location)?errors.location[0]:errors.location}
                        data={location.length > 0 ? location : [{ id: 0, city: 'No data available. Please try again later' }]}
                    />
                </Box>
                {/* Age */}
                <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Age Range"
                        name="age"
                        onChange={handleSelectChange}
                        register={register}
                        error={Array.isArray(errors.age)?errors.age[0]:errors.age}
                        data={ages.length > 0 ? ages : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                </Box>


                {/* Device */}
                <Box sx={{margin:2}}>
                  <FormField
                        type="text"
                        placeholder="Devices"
                        name="device"
                        register={register}
                        error={Array.isArray(errors.device)?errors.device[0]:errors.device}
                        data={devices.length > 0 ? devices : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                  </Box>

                {/* Environment */}
                <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Environments"
                        name="environment"
                        onChange={handleSelectChange}
                        register={register}
                        error={Array.isArray(errors.environment)?errors.environment[0]:errors.environment}
                        data={environment.length > 0 ? environment : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                </Box>
              </CardSection>
              
              {/* Targeting Type Section */}
              <CardSection title="Targeting Type">
                {/* Exchange */}
                <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Exchange"
                        name="exchange"
                        register={register}
                        error={Array.isArray(errors.exchange)?errors.exchange[0]:errors.exchange}
                        data={exchange.length > 0 ? exchange : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                </Box>

                {/* Carrier */}
                <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Carrier"
                        name="carrier"
                        onChange={handleSelectChange}
                        register={register}
                        error={Array.isArray(errors.carrier)?errors.carrier[0]:errors.carrier}
                        data={carrier.length > 0 ? carrier : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                  </Box>

                {/* Langugage */}
                <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Language"
                        name="language"
                        register={register}
                        error={Array.isArray(errors.language)?errors.language[0]:errors.language}
                        data={language.length > 0 ? language : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                  </Box>

                {/* DevicePrice */}
                <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="DevicePrice"
                        name="device_price"
                        register={register}
                        error={Array.isArray(errors.device_price)?errors.device_price[0]:errors.device_price}
                        data={devicePrice.length > 0 ? devicePrice : [{ id: 0, value: 'No data available. Please try again later' }]}
                    />
                  </Box>
              </CardSection>
              
              {/* Targeting Interest Section */}
              <CardSection title="Interest">
              {/* Interest */}
                <Box sx={{margin:2}}>
                  <FormField
                      type="text"
                      placeholder="Category"
                      name="distinct_interest"
                      register={register}
                      onChange={handleSelectChange}
                      data={distinctInterest.length > 0 ? distinctInterest : [{ id: 0, value: 'No data available. Please try again later' }]}
                      error={Array.isArray(errors.distinct_interest)?errors.distinct_interest[0]:errors.distinct_interest}
                  />
                </Box>

              {/* Interest Category*/}
                <Box sx={{margin:2}}>
                  <FormField
                      type="text"
                      placeholder="SubCategory"
                      name="target_type"
                      register={register}
                      error={Array.isArray(errors.target_type)?errors.target_type[0]:errors.target_type}
                      data={selectedInterest.length > 0 ? selectedInterest.slice(0,150) : [{ id: 0, category: 'No data available. Please select Interest' }]}
                      />
                </Box>
              </CardSection>

              {/* Campaign File Upload Section */}
              <CardSection title="File Upload">
                  {/* Image Upload */}
                <Box sx={{margin:2}}>
                    <FileUpload
                        name="images"
                        register={register}
                        setValue={setValue} // Pass setValue here
                        placeholder="Select Campaign Image(.jpeg,.png)"
                      />
                      {errors.images && 
                        <Typography sx={{ color: 'gray', fontSize: '0.75rem' }}>
                          {errors.images?.message}
                        </Typography>
                      }
                  </Box>

                  <Box sx={{margin:2}}>
                    <FileUpload
                      name="keywords"
                      register={register}
                      setValue={setValue}
                      placeholder="Select Keywords(.pdf)"
                    />
                    {errors.keywords && 
                      <Typography sx={{ color: 'gray', fontSize: '0.75rem' }}>
                        {errors.keywords?.message}
                      </Typography>
                    }
                  </Box>

                  <Box sx={{margin:2}}>
                    <FileUpload
                      name="proximity_store"
                      register={register}
                      setValue={setValue}
                      placeholder="Select Proximity Store Visit(.pdf)"
                    />
                  </Box>
                  <Box sx={{margin:2}}>
                    <FileUpload
                      name="proximity"
                      register={register}
                      setValue={setValue} 
                      placeholder="Select Proximity(.pdf)"
                    />
                  </Box>
                  <Box sx={{margin:2}}>
                    <FileUpload
                      name="weather"
                      register={register}
                      setValue={setValue}
                      placeholder="Select Weather(.pdf)"
                    />
                  </Box>
              </CardSection>
      
              {/* Submit Button */}
              {!isPending && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Button sx={{borderRadius:0.75}} variant="contained" color="primary" type="submit">
                    Create Campaign
                  </Button>
                </Box>
              )}
              
              {isPending && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Box sx={{ marginLeft: 2 }}>
                      <CircularProgress />
                    </Box>
                  </Box>
              )}
            </Box>
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            {isCampaignCreated ? <Alert color="success">Campaign created successfully</Alert> : null}
          </form>
        </Box>

        {/* Right Section (Chart) */}
          <Box
            sx={{
              flex: 1, // Adjust chart section size
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "background.paper",
              p: 2,
              border:1,
              borderColor: "grey.200",
              position: "sticky",
              top: '72px',
              alignSelf: 'flex-start',
            }}
          >
            <ImpressionChart title= "Expected Impression" targetPopulation={targetPopulation} totalPopulation={totalPopulation} />
          </Box>
      </Box>
    );
  }
  
  // CardSection Component
  function CardSection({
    title,
    children,
    defaultExpanded = false,
  }: {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean,

  }): React.JSX.Element {
    const [expanded, setExpanded] = React.useState<boolean>(defaultExpanded);
    return (
      <Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: 2,
            }}
          >
            <Typography variant="h6">{title}</Typography>
            <Button
              variant="text"
              onClick={() => setExpanded((prev) => !prev)}
              startIcon={expanded ? <CaretUp /> : <CaretDown />}
              sx={{
                color: "primary.contrastText", // Ensure button icon matches title text color
              }}
            />
          </Box>
          {expanded && <Box sx={{ mt: 2 }}>{children}</Box>}
        </Box>

      </Box>
    );
  }
  