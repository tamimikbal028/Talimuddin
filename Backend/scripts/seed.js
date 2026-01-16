import dotenv from "dotenv";
import mongoose from "mongoose";
import { Institution } from "../src/models/institution.model.js";
import { Department } from "../src/models/department.model.js";
import { DB_NAME } from "../src/constants/index.js";
import {
  INSTITUTION_TYPES,
  INSTITUTION_CATEGORY,
} from "../src/constants/index.js";

dotenv.config({ path: "./.env" });

const institutions = [
  {
    name: "Bangladesh University of Engineering and Technology",
    code: "BUET",
    type: INSTITUTION_TYPES.ENGINEERING_UNIVERSITY,
    category: INSTITUTION_CATEGORY.PUBLIC,
    validDomains: ["buet.ac.bd"],
    location: "Dhaka",
    website: "https://www.buet.ac.bd",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/f6/BUET_LOGO.svg",
    coverImage: "https://images.unsplash.com/photo-1562774053-701939374585",
    contactEmails: ["info@buet.ac.bd"],
    contactPhones: ["+880-2-9665650"],
    isActive: true,
  },
  {
    name: "University of Dhaka",
    code: "DU",
    type: INSTITUTION_TYPES.GENERAL_UNIVERSITY,
    category: INSTITUTION_CATEGORY.PUBLIC,
    validDomains: ["du.ac.bd"],
    location: "Dhaka",
    website: "https://www.du.ac.bd",
    logo: "https://upload.wikimedia.org/wikipedia/en/6/6f/University_of_Dhaka_logo.svg",
    coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
    contactEmails: ["registrar@du.ac.bd"],
    contactPhones: ["+880-2-9661900"],
    isActive: true,
  },
  {
    name: "North South University",
    code: "NSU",
    type: INSTITUTION_TYPES.GENERAL_UNIVERSITY,
    category: INSTITUTION_CATEGORY.PRIVATE,
    validDomains: ["northsouth.edu"],
    location: "Dhaka",
    website: "https://www.northsouth.edu",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7b/North_South_University_logo.png",
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    contactEmails: ["info@northsouth.edu"],
    contactPhones: ["+880-2-55668200"],
    isActive: true,
  },
  {
    name: "Dhaka Medical College",
    code: "DMC",
    type: INSTITUTION_TYPES.MEDICAL_COLLEGE,
    category: INSTITUTION_CATEGORY.GOVT,
    validDomains: ["dmc.edu.bd"],
    location: "Dhaka",
    website: "https://www.dmc.edu.bd",
    logo: "https://images.unsplash.com/photo-1584982751601-97dcc096659c",
    coverImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
    contactEmails: ["principal@dmc.edu.bd"],
    contactPhones: ["+880-2-8626812"],
    isActive: true,
  },
  {
    name: "Dhaka Polytechnic Institute",
    code: "DPI",
    type: INSTITUTION_TYPES.POLYTECHNIC_INSTITUTE,
    category: INSTITUTION_CATEGORY.GOVT,
    validDomains: ["dpi.gov.bd"],
    location: "Dhaka",
    website: "https://www.dpi.gov.bd",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    coverImage: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a",
    contactEmails: ["principal@dpi.gov.bd"],
    contactPhones: ["+880-2-9661891"],
    isActive: true,
  },
];

const departmentsByInstitution = {
  BUET: [
    {
      name: "Computer Science and Engineering",
      code: "CSE",
      description:
        "Leading department in computer science and software engineering",
      establishedYear: 1984,
    },
    {
      name: "Electrical and Electronic Engineering",
      code: "EEE",
      description: "Premier electrical engineering department in Bangladesh",
      establishedYear: 1962,
    },
    {
      name: "Mechanical Engineering",
      code: "ME",
      description: "Excellence in mechanical and industrial engineering",
      establishedYear: 1962,
    },
  ],
  DU: [
    {
      name: "Department of English",
      code: "ENG",
      description: "Oldest and most prestigious English department",
      establishedYear: 1921,
    },
    {
      name: "Department of Physics",
      code: "PHY",
      description: "Leading research in theoretical and applied physics",
      establishedYear: 1921,
    },
    {
      name: "Department of Economics",
      code: "ECO",
      description: "Top economics department producing national leaders",
      establishedYear: 1921,
    },
  ],
  NSU: [
    {
      name: "Department of Computer Science & Engineering",
      code: "CSE",
      description: "Modern CS curriculum with industry partnerships",
      establishedYear: 1993,
    },
    {
      name: "Department of Business Administration",
      code: "BBA",
      description: "AACSB accredited business school",
      establishedYear: 1993,
    },
    {
      name: "Department of Electrical & Computer Engineering",
      code: "ECE",
      description: "Cutting-edge research in electronics and computing",
      establishedYear: 1993,
    },
  ],
  DMC: [
    {
      name: "Department of Medicine",
      code: "MED",
      description: "Comprehensive internal medicine training",
      establishedYear: 1946,
    },
    {
      name: "Department of Surgery",
      code: "SUR",
      description: "Advanced surgical training and research",
      establishedYear: 1946,
    },
    {
      name: "Department of Pediatrics",
      code: "PED",
      description: "Specialized child healthcare and treatment",
      establishedYear: 1946,
    },
  ],
  DPI: [
    {
      name: "Computer Technology",
      code: "CT",
      description: "Diploma in computer technology and programming",
      establishedYear: 1955,
    },
    {
      name: "Civil Technology",
      code: "CVT",
      description: "Diploma in civil engineering and construction",
      establishedYear: 1955,
    },
    {
      name: "Electrical Technology",
      code: "ET",
      description: "Diploma in electrical systems and power",
      establishedYear: 1955,
    },
  ],
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Connect to database
    await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
    console.log("✅ Connected to MongoDB\n");

    // Clear existing data
    console.log("🗑️  Clearing existing institutions and departments...");
    await Institution.deleteMany({});
    await Department.deleteMany({});
    console.log("✅ Cleared existing data\n");

    // Insert institutions
    console.log("🏛️  Inserting institutions...");
    const insertedInstitutions = await Institution.insertMany(institutions);
    console.log(`✅ Inserted ${insertedInstitutions.length} institutions\n`);

    // Insert departments
    console.log("📚 Inserting departments...");
    let totalDepartments = 0;

    for (const institution of insertedInstitutions) {
      const depts = departmentsByInstitution[institution.code];
      if (depts) {
        const departmentsToInsert = depts.map((dept) => ({
          ...dept,
          institution: institution._id,
          contactEmails: institution.contactEmails,
          location: institution.location,
        }));

        await Department.insertMany(departmentsToInsert);
        totalDepartments += departmentsToInsert.length;
        console.log(
          `   ✓ Added ${departmentsToInsert.length} departments to ${institution.name}`
        );
      }
    }

    console.log(`\n✅ Inserted ${totalDepartments} departments total\n`);

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   • Institutions: ${insertedInstitutions.length}`);
    console.log(`   • Departments: ${totalDepartments}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
