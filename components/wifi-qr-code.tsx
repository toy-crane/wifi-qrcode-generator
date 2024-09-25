"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WifiQrCode() {
  const [networkName, setNetworkName] = useState("ODD");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [boxColor, setBoxColor] = useState("#000000");
  const [qrValue, setQrValue] = useState("");

  const generateQRCode = () => {
    const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    setQrValue(wifiString);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoxColor(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">WIFI QRCODE</h1>
      <div className="mb-6 flex justify-center">
        <div
          style={{ backgroundColor: boxColor }}
          className="px-8 py-6 flex flex-col items-center rounded-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">WIFI 접속</h2>
          {qrValue ? (
            <QRCodeSVG value={qrValue} size={256} />
          ) : (
            <div className="w-[256px] h-[256px] border-2 border-dashed border-gray-300 flex items-center justify-center " />
          )}
          <p className="mt-4 text-3xl font-bold text-white">{networkName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="networkName">브랜드 이름</Label>
          <Input
            id="networkName"
            value={networkName}
            onChange={(e) => setNetworkName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="ssid">네트워크 이름(SSID)</Label>
          <Input
            id="ssid"
            placeholder="Placeholder text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="Placeholder text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="encryption">암호화 유형</Label>
          <Select value={encryption} onValueChange={setEncryption}>
            <SelectTrigger>
              <SelectValue placeholder="Selected option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA/WPA2</SelectItem>
              <SelectItem value="WEP">WEP</SelectItem>
              <SelectItem value="nopass">No Encryption</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="boxColor">박스 배경색</Label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={boxColor}
              onChange={handleColorChange}
              className="w-10 h-10 p-0 border-0 rounded-md"
              aria-label="Select box background color"
            />
            <Input
              id="boxColor"
              value={boxColor}
              onChange={handleColorChange}
              className="flex-grow"
            />
          </div>
        </div>
      </div>

      <Button className="w-full mt-6" onClick={generateQRCode}>
        생성하기
      </Button>
    </div>
  );
}
