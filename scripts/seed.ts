import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: "user_admin_1",
        name: "Admin User",
        email: "admin@example.com",
        emailVerified: new Date(),
        image: "https://via.placeholder.com/150",
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "user_regular_1",
        name: "John Doe",
        email: "john@example.com",
        emailVerified: new Date(),
        image: "https://via.placeholder.com/150",
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "user_regular_2",
        name: "Jane Smith",
        email: "jane@example.com",
        emailVerified: new Date(),
        image: "https://via.placeholder.com/150",
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // Insert products
  await prisma.product.createMany({
    data: [
      {
        id: "prod_laptop_1",
        name: 'MacBook Pro 16"',
        quantity: 25,
        price: 2499.99,
      },
      {
        id: "prod_laptop_2",
        name: "Dell XPS 13",
        quantity: 40,
        price: 1299.99,
      },
      {
        id: "prod_laptop_3",
        name: "ThinkPad X1 Carbon",
        quantity: 30,
        price: 1899.99,
      },
      {
        id: "prod_mouse_1",
        name: "Logitech MX Master 3",
        quantity: 150,
        price: 99.99,
      },
      {
        id: "prod_mouse_2",
        name: "Apple Magic Mouse",
        quantity: 80,
        price: 79.99,
      },
      {
        id: "prod_keyboard_1",
        name: "Mechanical Keyboard RGB",
        quantity: 120,
        price: 149.99,
      },
      {
        id: "prod_keyboard_2",
        name: "Apple Magic Keyboard",
        quantity: 90,
        price: 129.99,
      },
      {
        id: "prod_monitor_1",
        name: '4K Monitor 27"',
        quantity: 60,
        price: 399.99,
      },
      {
        id: "prod_monitor_2",
        name: 'Ultrawide Monitor 34"',
        quantity: 35,
        price: 699.99,
      },
      {
        id: "prod_webcam_1",
        name: "Logitech C920 HD",
        quantity: 200,
        price: 79.99,
      },
      {
        id: "prod_webcam_2",
        name: "Logitech Brio 4K",
        quantity: 100,
        price: 199.99,
      },
      {
        id: "prod_headset_1",
        name: "Sony WH-1000XM4",
        quantity: 75,
        price: 349.99,
      },
      {
        id: "prod_headset_2",
        name: "Bose QuietComfort 35",
        quantity: 85,
        price: 299.99,
      },
      {
        id: "prod_dock_1",
        name: "USB-C Docking Station",
        quantity: 50,
        price: 249.99,
      },
      {
        id: "prod_cable_1",
        name: "USB-C Cable 2m",
        quantity: 300,
        price: 19.99,
      },
    ],
    skipDuplicates: true,
  });

  // Insert templates
  await prisma.template.createMany({
    data: [
      { id: "temp_office_basic", name: "Basic Office Setup" },
      { id: "temp_office_premium", name: "Premium Office Setup" },
      { id: "temp_gaming_setup", name: "Gaming Workstation" },
      { id: "temp_developer_setup", name: "Developer Workstation" },
      { id: "temp_meeting_room", name: "Meeting Room Package" },
      { id: "temp_remote_worker", name: "Remote Worker Kit" },
    ],
    skipDuplicates: true,
  });

  // Template Products
  const templateProducts = [
    // Basic Office
    {
      id: "tp_basic_1",
      templateId: "temp_office_basic",
      productId: "prod_laptop_2",
      quantity: 1,
    },
    {
      id: "tp_basic_2",
      templateId: "temp_office_basic",
      productId: "prod_mouse_1",
      quantity: 1,
    },
    {
      id: "tp_basic_3",
      templateId: "temp_office_basic",
      productId: "prod_keyboard_2",
      quantity: 1,
    },
    {
      id: "tp_basic_4",
      templateId: "temp_office_basic",
      productId: "prod_monitor_1",
      quantity: 1,
    },
    {
      id: "tp_basic_5",
      templateId: "temp_office_basic",
      productId: "prod_webcam_1",
      quantity: 1,
    },

    // Premium Office
    {
      id: "tp_premium_1",
      templateId: "temp_office_premium",
      productId: "prod_laptop_1",
      quantity: 1,
    },
    {
      id: "tp_premium_2",
      templateId: "temp_office_premium",
      productId: "prod_mouse_1",
      quantity: 1,
    },
    {
      id: "tp_premium_3",
      templateId: "temp_office_premium",
      productId: "prod_keyboard_1",
      quantity: 1,
    },
    {
      id: "tp_premium_4",
      templateId: "temp_office_premium",
      productId: "prod_monitor_2",
      quantity: 1,
    },
    {
      id: "tp_premium_5",
      templateId: "temp_office_premium",
      productId: "prod_webcam_2",
      quantity: 1,
    },
    {
      id: "tp_premium_6",
      templateId: "temp_office_premium",
      productId: "prod_headset_1",
      quantity: 1,
    },
    {
      id: "tp_premium_7",
      templateId: "temp_office_premium",
      productId: "prod_dock_1",
      quantity: 1,
    },

    // Gaming
    {
      id: "tp_gaming_1",
      templateId: "temp_gaming_setup",
      productId: "prod_laptop_1",
      quantity: 1,
    },
    {
      id: "tp_gaming_2",
      templateId: "temp_gaming_setup",
      productId: "prod_mouse_1",
      quantity: 2,
    },
    {
      id: "tp_gaming_3",
      templateId: "temp_gaming_setup",
      productId: "prod_keyboard_1",
      quantity: 1,
    },
    {
      id: "tp_gaming_4",
      templateId: "temp_gaming_setup",
      productId: "prod_monitor_2",
      quantity: 2,
    },
    {
      id: "tp_gaming_5",
      templateId: "temp_gaming_setup",
      productId: "prod_headset_1",
      quantity: 1,
    },
    {
      id: "tp_gaming_6",
      templateId: "temp_gaming_setup",
      productId: "prod_webcam_2",
      quantity: 1,
    },

    // Developer
    {
      id: "tp_dev_1",
      templateId: "temp_developer_setup",
      productId: "prod_laptop_3",
      quantity: 1,
    },
    {
      id: "tp_dev_2",
      templateId: "temp_developer_setup",
      productId: "prod_mouse_1",
      quantity: 1,
    },
    {
      id: "tp_dev_3",
      templateId: "temp_developer_setup",
      productId: "prod_keyboard_1",
      quantity: 1,
    },
    {
      id: "tp_dev_4",
      templateId: "temp_developer_setup",
      productId: "prod_monitor_1",
      quantity: 2,
    },
    {
      id: "tp_dev_5",
      templateId: "temp_developer_setup",
      productId: "prod_webcam_1",
      quantity: 1,
    },
    {
      id: "tp_dev_6",
      templateId: "temp_developer_setup",
      productId: "prod_dock_1",
      quantity: 1,
    },
    {
      id: "tp_dev_7",
      templateId: "temp_developer_setup",
      productId: "prod_cable_1",
      quantity: 3,
    },

    // Meeting Room
    {
      id: "tp_meeting_1",
      templateId: "temp_meeting_room",
      productId: "prod_laptop_2",
      quantity: 1,
    },
    {
      id: "tp_meeting_2",
      templateId: "temp_meeting_room",
      productId: "prod_monitor_1",
      quantity: 1,
    },
    {
      id: "tp_meeting_3",
      templateId: "temp_meeting_room",
      productId: "prod_webcam_2",
      quantity: 1,
    },
    {
      id: "tp_meeting_4",
      templateId: "temp_meeting_room",
      productId: "prod_headset_2",
      quantity: 4,
    },
    {
      id: "tp_meeting_5",
      templateId: "temp_meeting_room",
      productId: "prod_cable_1",
      quantity: 5,
    },

    // Remote Worker
    {
      id: "tp_remote_1",
      templateId: "temp_remote_worker",
      productId: "prod_laptop_2",
      quantity: 1,
    },
    {
      id: "tp_remote_2",
      templateId: "temp_remote_worker",
      productId: "prod_mouse_2",
      quantity: 1,
    },
    {
      id: "tp_remote_3",
      templateId: "temp_remote_worker",
      productId: "prod_keyboard_2",
      quantity: 1,
    },
    {
      id: "tp_remote_4",
      templateId: "temp_remote_worker",
      productId: "prod_webcam_1",
      quantity: 1,
    },
    {
      id: "tp_remote_5",
      templateId: "temp_remote_worker",
      productId: "prod_headset_2",
      quantity: 1,
    },
    {
      id: "tp_remote_6",
      templateId: "temp_remote_worker",
      productId: "prod_dock_1",
      quantity: 1,
    },
  ];

  await prisma.templateProduct.createMany({
    data: templateProducts,
    skipDuplicates: true,
  });

  // Insert invoices
  const now = new Date();
  await prisma.invoice.createMany({
    data: [
      {
        id: "inv_001",
        templateId: "temp_office_basic",
        totalPrice: 2009.95,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv_002",
        templateId: "temp_office_premium",
        totalPrice: 4578.92,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv_003",
        templateId: "temp_gaming_setup",
        totalPrice: 6048.93,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv_004",
        templateId: "temp_developer_setup",
        totalPrice: 4109.94,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv_005",
        templateId: "temp_remote_worker",
        totalPrice: 2039.94,
        createdAt: now,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
