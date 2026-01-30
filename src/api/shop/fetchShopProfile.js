"use server";

import { cookies } from "next/headers";

export async function fetchShopProfile() {
  const cookie = await cookies();

  const shopturboAuthToken = cookie.get("shopturboAuthToken")?.value;
  const shopturboShopId = cookie.get("shopturboShopId")?.value;

  if (!shopturboAuthToken || !shopturboShopId) {
    return { status: 401, data: null };
  }

  try {
    const [shopInfo, shopProfile] = await Promise.all([
      fetch(
        `${process.env.SERVER_URL}/api/shopee/shop/info/${shopturboShopId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${shopturboAuthToken}`,
          },
        },
      ),

      fetch(
        `${process.env.SERVER_URL}/api/shopee/shop/profile/${shopturboShopId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${shopturboAuthToken}`,
          },
        },
      ),
    ]);

    if (!shopInfo.ok && !shopProfile.ok)
      return {
        status: `statusShopInfo: ${shopInfo.status}, statusShopProfile: ${shopProfile.status}`,
        message:
          "There was a problem trying to search for the shop profile in fetchShopProfile()",
        data: null,
      };

    const shopInfoData = await shopInfo.json();
    const shopProfileData = await shopProfile.json();

    const shopData = {
      ...shopInfoData.data,
      profile: shopProfileData.data.response,
    };

    return { status: 200, data: shopData };
  } catch (err) {
    return {
      status: 500,
      message:
        "There was a problem trying to search for the shop profile in fetchShopProfile().",
      data: err,
    };
  }
}
