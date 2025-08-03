import NavBarClient from "./NavBarClient";
import { headers } from "next/headers";

export default async function NavBarServer () {
    
    const hds = await headers();
    const host =  hds.get("x-forwarded-host")??hds.get("host");
    const proto = hds.get("x-forwarded-proto")??"https";
    const pathAndQuery =  hds.get("next-url")??"";
    const baseUrl = `${proto}://${host}`

    
  return (
    <>
      <NavBarClient baseUrl={baseUrl} />
    </>
  );
}
