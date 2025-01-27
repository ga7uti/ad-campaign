"use client"
import { campaignClient } from '@/lib/campaign-client';
import { utils } from '@/lib/common';
import { paths } from '@/paths';
import { CampaignFormData, CommonSelectResponse, ImpressionData, Interest, Location } from '@/types/campaign';
import { CampaignFormSchema } from '@/types/form-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, SelectChangeEvent, Typography } from '@mui/material';
import { CaretDown, CaretUp, Image, Video } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from '../layout/file-upload';
import FormField from '../layout/form-field';
import { ImpressionComponent } from './impression-panel';
import { CampaignTypeSelector } from './campaign-select';
import CardSection from './card-section';


export default function CreateCampaign(): React.JSX.Element {

    const router = useRouter();
    const [dataSources, setDataSources] = React.useState({
      ages: [],
      devices: [],
      environment: [],
      location: [],
      exchange: [],
      language: [],
      carrier: [],
      devicePrice: [],
      distinctInterest: [],
      selectedInterest: [],
      buy_type: [],
      brand_safety: [],
      viewability: [],
    } as Record<string, CommonSelectResponse[] | Location[] | Interest[]>)
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const [isCampaignCreated,setIsCampaignCreated] = React.useState<boolean>(false);
    const [impressionData,setImpressionData] = React.useState<ImpressionData>();
    const [totalPopulation,setTotalPopulation] = React.useState<number>(0);
    const [targetPopulation, setTargetPopulation] = React.useState<number>(0);
    const [previousName, setPreviousName] = React.useState<string>("");
    const [calPopulation, setCalPopulation] = React.useState <number>(0)
    const [activeSection, setActiveSection] = React.useState<number>(0); 
    const [campaignType, setCampaignType] = React.useState<'banner' | 'video'>('banner');

    const {
      register,
      setValue,
      setError,
      clearErrors,
      handleSubmit,
      formState: { errors },
    } = useForm<CampaignFormData>({ resolver: zodResolver(CampaignFormSchema) });
  
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
      if ((name === "age")) {
        
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
            const locationData = dataSources.location.find((loc) => loc.id === parseInt(data)) as Location;
            if (locationData) {
              newTargetPopulation += Number(locationData.population);
            }
          });

          // Update the target population after location selection
          console.log("New Target Population after location selection:", newTargetPopulation);
          setTargetPopulation(newTargetPopulation);
        }
    };


    const fileUploadFields = [
      {
        name: "images",
        placeholder: "Select Campaign Image(.jpeg,.png,.zip)",
        condition: campaignType === "banner", // Only show for banner
        error: errors.images,
      },
      {
        name: "video",
        placeholder: "Select Campaign Video(.mp4,.mov)",
        condition: campaignType !== "banner", // Only show for non-banner (video)
        error: errors.video,
      },
      {
        name: "keywords",
        placeholder: "Select Keywords(.pdf)",
        condition: true, // Always show this field
        error: errors.keywords,
      },
    ];

    const targetingTypeFields = [
      {
        name: "location",
        placeholder: "Locations",
        data: dataSources.location,
        error: errors.location,
        onChange: handleSelectChange,
      },
      {
        name: "age",
        placeholder: "Age Range",
        data: dataSources.ages,
        error: errors.age,
        onChange: handleSelectChange,
      },
      {
        name: "exchange",
        placeholder: "Exchange",
        data: dataSources.exchange,
        error: errors.exchange,
      },
      {
        name: "language",
        placeholder: "Language",
        data: dataSources.language,
        error: errors.language,
      },
      {
        name: "viewability",
        placeholder: "Viewability",
        data: dataSources.viewability,
        error: errors.viewability,
        multiple: false,
      },
      {
        name: "brand_safety",
        placeholder: "Brand Safety",
        data: dataSources.brand_safety,
        error: errors.brand_safety,
        multiple: false,
      },
    ];

    const deviceFields = [
      {
        name: "device",
        placeholder: "Devices",
        data: dataSources.devices,
        error: errors.device,
      },
      {
        name: "environment",
        placeholder: "Environments",
        data: dataSources.environment,
        error: errors.environment,
        onChange: handleSelectChange,
      },
      {
        name: "carrier",
        placeholder: "Carrier",
        data: dataSources.carrier,
        error: errors.carrier,
        onChange: handleSelectChange,
      },
      {
        name: "device_price",
        placeholder: "DevicePrice",
        data: dataSources.devicePrice,
        error: errors.device_price,
      },
    ];

    const onSubmit = async (data: CampaignFormData) => {
      // if (campaignType ==='banner'! && (!data.images || data.images.length === 0)) {
      //   setError('images',{message:"Image is required"});
      //   return;
      // }

      // if (campaignType ==='video'! && (!data.video || data.video.length === 0)) {
      //   setError('video',{message:"Video is required"});
      //   return;
      // }

      console.log("Data",data)
      clearErrors();
      //createCampaign(data);
    };
  
    const fetchData = async () => {
      try {
        const [ageRes, deviceRes, envRes, locRes,exchangeRes,langRes,
          carrierRes,devicePriceRes, interestRes, impressionRes,buyTypeRes,
          viewabilityRes,brandSafetyRes] = await Promise.all([
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
          campaignClient.getBuyType(),
          campaignClient.getViewability(),
          campaignClient.getBrandSafety(),
        ]);
        setDataSources({
          ages: ageRes,
          devices: deviceRes,
          environment: envRes,
          location: locRes,
          exchange: exchangeRes,
          language: langRes,
          carrier: carrierRes,
          devicePrice: devicePriceRes,
          distinctInterest: interestRes,
          selectedInterest: [],
          buy_type:buyTypeRes,
          viewability:viewabilityRes,
          brand_safety:brandSafetyRes
        });
        setImpressionData(impressionRes)
        setTotalPopulation(impressionRes.totalPopulation)
      } catch (error) {
        setError('root', { type: 'server', message: "Failed to load campaign data. Error: " + error});
      }
    };
  
    const fetchSelectedInterest = async (interest: string) => {
      try {
        const result = await campaignClient.getSelectedInterest(interest);
        setDataSources((prev) => ({
          ...prev,
          selectedInterest: result,
        }));
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

  
    const nextSection = () => {
        if (activeSection < 6) { 
            setActiveSection(activeSection + 1);
        }
    };

    const prevSection = () => {
        if (activeSection > 0) {
            setActiveSection(activeSection - 1);
        }
    };
  
    React.useEffect(() => {
      fetchData();
    }, []);
  
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: { xs: 2, sm: 3, md: 4 },
          p: { xs: 1, sm: 2, md: 3 },
          
        }}
      >
        <Box sx={{ flex: { xs: "1", md: "2" , lg:"3"}, overflow: "hidden" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", 
                flexDirection: "column",
                gap: 3 ,
                border: 1,
                padding:2 ,
                borderColor: "grey.300",
            }}>


              {activeSection === 0 && (
                 <CardSection title="Campaign Type">
                    <CampaignTypeSelector campaignType={campaignType} setCampaignType={setCampaignType} />
                  </CardSection>
               )}

              {activeSection === 1 && (
                  <CardSection title="Campaign Details">
                    {/* Name */}
                    <Box sx={{margin:2}}>
                        <FormField
                            type="text"
                            placeholder="Name"
                            name="name"
                            register={register}
                            error={errors.name}
                        />
                    </Box>
                  </CardSection>
              )}

              {activeSection === 2 && (
                <CardSection title="Targeting Type">
                  <>
                    {targetingTypeFields.map((field, index) => (
                      <Box sx={{ margin: 2 }} key={index}>
                        <FormField
                          type="text"
                          placeholder={field.placeholder}
                          name={field.name}
                          register={register}
                          onChange={field.onChange}
                          error={Array.isArray(field.error) ? field.error[0] : field.error}
                          data={field.data.length > 0 ? field.data : [{ id: 0, value: 'No data available. Please try again later' }]}
                          multiple={field.multiple}
                        />
                      </Box>
                    ))}
                  </>
                </CardSection>
              )}

              {activeSection === 3 && (
                  <CardSection title="Device & Environment">
                    <>
                      {deviceFields.map((field, index) => (
                        <Box sx={{ margin: 2 }} key={index}>
                          <FormField
                            type="text"
                            placeholder={field.placeholder}
                            name={field.name}
                            register={register}
                            onChange={field.onChange}
                            error={Array.isArray(field.error) ? field.error[0] : field.error}
                            data={field.data.length > 0 ? field.data : [{ id: 0, value: 'No data available. Please try again later' }]}
                          />
                        </Box>
                      ))}
                    </>
                  
                  </CardSection>
              )}

              {activeSection === 4 && (
                <CardSection title="Interest">
                {/* Interest */}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Category"
                        name="distinct_interest"
                        register={register}
                        onChange={handleSelectChange}
                        data={dataSources.distinctInterest.length > 0 ? dataSources.distinctInterest : [{ id: 0, value: 'No data available. Please try again later' }]}
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
                        data={dataSources.selectedInterest.length > 0 ? dataSources.selectedInterest.slice(0,150) : [{ id: 0, category: 'No data available. Please select Interest' }]}
                        />
                  </Box>
                </CardSection>
              )}

              {activeSection === 5 && (
                <CardSection title="Budget & Bidding">
                  {/* Total Budget */}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="number"
                        placeholder="Total Budget"
                        name="total_budget"
                        valueAsNumber={true}
                        register={register}
                        error={Array.isArray(errors.total_budget)?errors.total_budget[0]:errors.total_budget}
                    />
                  </Box>

                  {/* Buy Type*/}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Buy Type"
                        name="buy_type"
                        register={register}
                        error={errors.buy_type}
                        data={dataSources.buy_type.length > 0 ? dataSources.buy_type : [{ id: 0, value: 'No data available. Please try again later' }]}
                        multiple={false}
                        />
                  </Box>

                  {/* Unit Rate*/}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="number"
                        placeholder="Unit Rate"
                        name="unit_rate"
                        valueAsNumber={true}
                        register={register}
                        error={Array.isArray(errors.unit_rate)?errors.unit_rate[0]:errors.unit_rate}
                        />
                  </Box>
                </CardSection>
              )}

              {activeSection === 6 && (
                <CardSection title="Ad Details">
                  {/* Landing Page */}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Landing Page"
                        name="landing_page"
                        register={register}
                        error={errors.landing_page}
                        data={undefined}
                    />
                  </Box>

                  {/* Tag & Tracker */}
                  <Box sx={{margin:2}}>
                    <FormField
                        type="text"
                        placeholder="Tag & Tracker"
                        name="tag_tracker"
                        register={register}
                        error={errors.tag_tracker}
                        data={undefined}
                    />
                  </Box>
                  
                  <>
                    {fileUploadFields.map((field, index) => (
                      field.condition && (
                        <Box sx={{ margin: 2 }} key={index}>
                          <FileUpload
                            name={field.name}
                            register={register}
                            setValue={setValue}
                            placeholder={field.placeholder}
                          />
                          {field.error && (
                            <Typography sx={{ color: "gray", fontSize: "0.75rem" }}>
                              {field.error?.message}
                            </Typography>
                          )}
                        </Box>
                      )
                    ))}
                  </>
                </CardSection>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" onClick={prevSection} disabled={activeSection === 0}>
                  Previous
                </Button>
                {activeSection < 6 && (
                  <Button variant="contained" color="primary" onClick={nextSection}> Next
                  </Button>
                )}
              </Box>

            {activeSection === 6 && !isPending && (
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
            {isCampaignCreated ? <Alert sx={{margin:2}} color="success">Campaign created successfully!</Alert> : null}
          </form>
        </Box>

        {/* Right Section (Chart) */}
          <Box
            sx={{
              flex: { xs: "1", md: "1", lg:"1" },
              display: "flex",
              flexDirection: "column",
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
            <ImpressionComponent title= " Campaign Population Breakdown" targetPopulation={targetPopulation} totalPopulation={totalPopulation} />
          </Box>
      </Box>
    );
  }

  