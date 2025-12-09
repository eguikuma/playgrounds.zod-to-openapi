import { db } from "@/utilities";

const main = async () => {
  await db.user.createMany({
    data: [
      {
        name: "ユーザーA",
      },
      {
        name: "ユーザーB",
      },
      {
        name: "ユーザーC",
      },
    ],
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
