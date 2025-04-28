import { SuccessCreateResponse } from "@/types/response";
import * as ImagePicker from "expo-image-picker";
import { Media } from "@/types/media";


export async function createMediaQuery(assets: ImagePicker.ImagePickerAsset[]) {

	const promises = [];

	for (let asset of assets) {
		promises.push(uploadMedia(asset, "/api/media"));
	}

	return Promise.all(promises);
}

// use fetch for file upload polyfill
const uploadMedia = async (asset: ImagePicker.ImagePickerAsset, apiUrl: string) => {
	const formData = new FormData();
	formData.append("file", {
		uri: asset.uri,
		name: asset.fileName ?? "file.jpg",
		type: asset.mimeType ?? "image/jpeg",
	} as any);

	formData.append("_payload", JSON.stringify({
		alt: asset.fileName ?? "file",
	}));

  const response = await fetch("http://localhost:3000" + apiUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<SuccessCreateResponse<Media>>;
};
