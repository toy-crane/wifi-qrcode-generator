"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  networkName: z.string().min(1, "브랜드 이름을 입력해주세요."),
  ssid: z.string().min(1, "네트워크 이름을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
  encryption: z.enum(["WPA", "WEP", "nopass"]),
  boxColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "유효한 색상 코드를 입력해주세요."),
});

type FormValues = z.infer<typeof formSchema>;

export function WifiQrCode() {
  const [qrValue, setQrValue] = useState("");
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      networkName: "",
      ssid: "",
      password: "",
      encryption: "WPA",
      boxColor: "#000000",
    },
  });

  function onSubmit(data: FormValues) {
    const wifiString = `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
    setQrValue(wifiString);
  }

  const handleDownload = async () => {
    if (qrContainerRef.current && qrValue) {
      const dataUrl = await htmlToImage.toPng(qrContainerRef.current);
      const link = document.createElement("a");
      link.download = "wifi-qr-code.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">WIFI QRCODE</h1>
      <div className="mb-6 flex flex-col items-center">
        <div
          ref={qrContainerRef}
          style={{ backgroundColor: form.watch("boxColor") }}
          className="px-8 py-6 flex flex-col items-center rounded-lg relative"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">WIFI 접속</h2>
          {qrValue ? (
            <QRCodeSVG value={qrValue} size={256} />
          ) : (
            <div className="w-[256px] h-[256px] border-2 border-dashed border-gray-300 flex items-center justify-center " />
          )}
          <p className="mt-4 text-3xl font-bold text-white">
            {form.watch("networkName")}
          </p>
          <span className="absolute bottom-2 right-2 text-xs text-white opacity-70">
            by toycrane
          </span>
        </div>
        {qrValue && (
          <Button onClick={handleDownload} className="mt-4">
            QR 코드 다운로드
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="networkName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>브랜드 이름</FormLabel>
                <FormControl>
                  <Input placeholder="브랜드 이름을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ssid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>네트워크 이름(SSID)</FormLabel>
                <FormControl>
                  <Input placeholder="네트워크 이름을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="encryption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>암호화 유형</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="암호화 유형을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">암호화 없음</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="boxColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>박스 배경색</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <input
                        type="color"
                        {...field}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        aria-label="Select box background color"
                      />
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                    <Input {...field} className="flex-grow" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-6">
            생성하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
