import { NextResponse } from "next/server";

const patients = [
    { id: "#SP-8821", name: "John Doe", status: "stable", age: 42, gender: "Male", blood: "O+", height: "182 cm", dob: "05/12/1982", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuSLr2gtogdRcX8KqE2njH0qwwxO0FRQ-svq3_KqTCZM6AcAj-YHVYmz5UShxuYBS46B1m9kLu3sG4J2td7lzmORCnGJSKQ_JrV4OTnpisCGQUpQHQd3B9BQfO2zGIpgEGK_HxCexO-tS5Uev5UiB_rXxTATPfpyUmDb4u-kGC16SXZp_voiw20_G_s8zaW1s40BMTC8m3MSjrOeClbCA9d-Y8um31NQomASHBDiGPKDZi81nSVi98aBaxG9SOwlv6e9hpILSH9B4" },
    { id: "#SP-9012", name: "Jane Smith", status: "warning", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDKvSWeUT4egmm_1YafV1fEzOz-ZLxCAMNLDhbtLK778kI8rGWzJl_MSa7NlO-3oAc57My6GHLqpSVK0LdxhbLh5Z58UNZ9vyfaBbzcVqaisJ1RWoLZ-FrNyMmp53NhiGipT3QL9kyCkecp9a2j2PPJ-enZ5EQ128ZwEBJMFDrx2te1nnqIOIzkf3Uam2FISfavphKWNPifMFl8cMcygAA9aoyBW-9oGoL8h4xUcsBbEyLDXP29FTBzfXp_uFbux5VrckdpG_yCG4" },
    { id: "#SP-7734", name: "Robert Chen", status: "stable", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS_t9ExPDHSa96FHUI7kcOeuOqTtRexqQjf3LksnH-oOdHbSn3MMwIYZMR4hXBVFiMBWG_HK_0B1bR1CCImQlDnz9uUlQCI3iLAOaVl3D_b_UX-QNHjfZzi0oGJlg1SJmDw4ab2J20w390QfVCUVr8a2XAgFS1TcH_pAmxOGawsll8qfJ_OshAglfl5Bq8bi2u1sdzCTLlUMxdIUYJ3qSjGaiaLOOoBHM7oNTH7vCfQHyOTh8l82bb1sArgL5hn_yVtytSeN7e3BY" },
];

export async function GET() {
    return NextResponse.json(patients);
}
