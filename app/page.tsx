import WeatherWidgetV2 from "@/components/weather-widget-v2";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// icons
import WeatherWidgetV1 from "@/components/weather-widget-v1";

export default function Home() {
  return (
    <main className="relative">
      <div className="flex w-screen h-screen bg-white">
        <div className="z-12 relative grid min-h-[100dvh] grid-cols-1 flex-col items-center justify-center p-2 transition-all duration-300 ease-in-out lg:flex w-full">
          <div className="bg-muted h-full w-full overflow-clip rounded-3xl">
            <div className="relative h-full w-full">
              <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs
                  defaultValue="1h"
                  className="absolute top-1/6 left-1/2 rounded-3xl -translate-x-1/2 w-80 aspect-[3/4] md:w-100 lg:w-180 overflow-hidden cursor-pointer transition-all duration-500"
                >
                  <TabsList>
                    <TabsTrigger value="1h">1H time spent</TabsTrigger>
                    <TabsTrigger value="3h">3H time spent</TabsTrigger>
                  </TabsList>
                  {/*  */}
                  <TabsContent value="1h">
                    <Card className="border-none inset-0 h-auto w-full bg-white">
                      <CardContent className="grid gap-6">
                        <WeatherWidgetV1 />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="3h">
                    <Card className="border-none inset-0 h-auto">
                      <CardContent className="grid gap-6">
                        <WeatherWidgetV2 />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
