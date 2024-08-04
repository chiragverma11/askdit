import ImageKit from "imagekit";
import { db } from "./db";
import { env } from "@/env.mjs";
import { MediaPostValidator } from "./validators/post";
import { z } from "zod";
import { EditorJSContent } from "@/types/utilities";

export type MediaContent = Pick<
  z.infer<typeof MediaPostValidator>,
  "content"
>["content"];

// export const seedUpdatedAtInComments = async () => {
//   const comments = await db.comment.findMany({
//     select: {
//       id: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
//
//   await Promise.all(
//     comments.map(async (comment) => {
//       await db.comment.update({
//         where: {
//           id: comment.id,
//         },
//         data: {
//           updatedAt: comment.createdAt,
//         },
//       });
//     }),
//   );
//
//   return { comments };
// };
//
// export const seedPostScore = async () => {
//   const posts = await db.post.findMany({
//     select: {
//       id: true,
//       title: true,
//       createdAt: true,
//       updatedAt: true,
//       voteScore: true,
//       votes: true,
//       _count: {
//         select: {
//           comments: {
//             where: {
//               deleted: false,
//             },
//           },
//         },
//       },
//     },
//   });
//
//   // calculating post score
//   posts.map((post, index) => {
//     const voteScore = post.votes.reduce((acc, vote) => {
//       if (vote.type === "UP") {
//         return acc + 1;
//       } else if (vote.type === "DOWN") {
//         return acc - 1;
//       }
//
//       return acc;
//     }, 0);
//
//     // const now = new Date();
//     // const postAgeInHours = Math.floor(
//     //   (+now - +new Date(post.createdAt)) / 3600000,
//     // );
//     // const decayFactor = -Math.log(postAgeInHours + 1) / 8;
//
//     // const voteScore = votes + post._count.comments * 0.05 + decayFactor;
//
//     posts[index].voteScore = voteScore;
//   });
//
//   await Promise.all(
//     posts.map(async (post) => {
//       await db.post.update({
//         where: {
//           id: post.id,
//         },
//         data: {
//           voteScore: post.voteScore,
//         },
//       });
//     }),
//   );
//
//   return posts;
// };
//
// export const seedMediaPostSize = async () => {
//   const mediaPosts = await db.post.findMany({
//     where: { type: "MEDIA" },
//     select: {
//       id: true,
//       content: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//
//   const postsWithoutImageSize = mediaPosts.filter((post) => {
//     if (post.content) {
//       return !(post.content as MediaContent).images?.some(
//         (image) => image.size,
//       );
//     }
//   });
//
//   await Promise.all(
//     postsWithoutImageSize.map(async (post) => {
//       const imageIds = (post.content as MediaContent).images.map(
//         (image) => image.id,
//       );
//       const imagekit = new ImageKit({
//         publicKey: env.IMAGEKIT_PUBLIC_KEY,
//         privateKey: env.IMAGEKIT_PRIVATE_KEY,
//         urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
//       });
//
//       await Promise.all(
//         imageIds.map(async (imageId) => {
//           const { fileId, size } = await imagekit.getFileDetails(imageId);
//           if (imageId === fileId) {
//             (post.content as MediaContent).images.forEach((image) => {
//               if (image.id === imageId) {
//                 image.size = size;
//               }
//             });
//           }
//         }),
//       );
//     }),
//   );
//
//   // await Promise.all(postsWithoutImageSize.map(async (post) => {
//   //   if (post.content)
//   //     await db.post.update({
//   //       where: { id: post.id },
//   //       data: {
//   //         content: post.content
//   //       }
//   //     })
//   // }))
//
//   return postsWithoutImageSize;
// };

export const seedStorageUsedInPosts = async () => {
  const posts = await db.post.findMany({
    where: { type: "POST" },
    select: {
      id: true,
      content: true,
      storageUsed: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const imagePosts = posts.filter((post) => {
    if (post.content) {
      return (post.content as EditorJSContent).blocks.some(
        (block) => block.type === "image",
      );
    }
  });

  imagePosts.forEach((post, index) => {
    if (post.content) {
      const storageUsed = (post.content as EditorJSContent).blocks.reduce(
        (acc, block) => {
          if (block.type === "image") {
            return acc + block.data.file.size;
          }
          return acc;
        },
        0,
      );

      imagePosts[index].storageUsed = storageUsed;
    }
  });

  await Promise.all(
    imagePosts.map(async (post) => {
      await db.post.update({
        where: { id: post.id },
        data: {
          storageUsed: post.storageUsed,
        },
      });
    }),
  );

  return imagePosts;
};

export const seedStorageUsedInMediaPosts = async () => {
  const mediaPosts = await db.post.findMany({
    where: { type: "MEDIA", createdAt: { lte: new Date("8 feb 2024") } },
    select: {
      id: true,
      content: true,
      storageUsed: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  mediaPosts.forEach((post) => {
    if (post.content) {
      const storageUsed = (post.content as MediaContent).images.reduce(
        (acc, image) => acc + image.size || 0,
        0,
      );

      post.storageUsed = storageUsed;
    }
  });

  await Promise.all(
    mediaPosts.map(async (post) => {
      await db.post.update({
        where: { id: post.id },
        data: {
          storageUsed: post.storageUsed,
        },
      });
    }),
  );

  return mediaPosts;
};

export const seedPostImageData = async () => {
  const posts = await db.post.findMany({
    where: { type: "POST" },
    select: {
      id: true,
      content: true,
      storageUsed: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const imagePosts = posts.filter((post) => {
    if (post.content) {
      return (post.content as EditorJSContent).blocks.some(
        (block) =>
          block.type === "image" && block.data?.file?.size === undefined,
      );
    }
  });

  const files = await getAllImagekitFiles();

  imagePosts.forEach((post, index) => {
    if (post.content) {
      return (post.content as EditorJSContent).blocks.forEach(
        (block, blockIndex) => {
          files.forEach((file) => {
            if (block.type === "image") {
              if (block.data?.file?.url.split("?")[0] === file.url) {
                (imagePosts[index].content as EditorJSContent).blocks[
                  blockIndex
                ].data.file.id = file.fileId;
                (imagePosts[index].content as EditorJSContent).blocks[
                  blockIndex
                ].data.file.size = file.size;
                (imagePosts[index].content as EditorJSContent).blocks[
                  blockIndex
                ].data.file.width = file.width;
                (imagePosts[index].content as EditorJSContent).blocks[
                  blockIndex
                ].data.file.height = file.height;
              }
            }
          });
        },
      );
    }
  });

  await Promise.all(
    imagePosts.map(async (post) => {
      if (post.content) {
        await db.post.update({
          where: { id: post.id },
          data: {
            content: post.content,
          },
        });
      }
    }),
  );
  // return posts;
  return imagePosts;
};

export const getAllImagekitFiles = async () => {
  const imagekit = new ImageKit({
    publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: "private_VeGJ1WzhuiITYIETo6YExjN5JHk=",
    urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  });

  const files = await imagekit.listFiles({
    path: "/askdit/post/regular/images",
  });

  return files;
};

export const seedUserStorageUsed = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      posts: {
        select: { id: true, storageUsed: true },
      },
    },
  });

  users.forEach(async (user) => {
    const storageUsed = user.posts.reduce((acc, post) => {
      return acc + post.storageUsed;
    }, 0);

    await db.user.update({
      where: { id: user.id },
      data: {
        storageUsed,
      },
    });
  });

  return { users };
};

export const seedStorageUsed = async () => {
  const usersWithPost = await db.user.findMany({
    where: { posts: { some: { type: "POST" } } },
    select: {
      id: true,
      username: true,
      posts: { select: { id: true, content: true, type: true } },
    },
  });

  console.log(usersWithPost.map((user) => user.username));

  const images = [];

  usersWithPost.forEach(async (user) => {
    console.log(user.username);

    const posts = user.posts.filter((post) => post.type === "POST");

    const imagePostsUrl = posts.flatMap((post: any) =>
      post.content?.blocks?.flatMap((block: any) => {
        if (block?.type === "image") {
          return block.data.file.url;
        }
      }),
    );

    const imagePostsUrlFiltered = imagePostsUrl.filter(
      (url) => typeof url === "string",
    );

    console.log(imagePostsUrlFiltered);

    const imagekit = new ImageKit({
      publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      privateKey: "private_VeGJ1WzhuiITYIETo6YExjN5JHk=",
      urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });

    imagePostsUrlFiltered.forEach(async (url) => {
      imagekit.getFileMetadata(url, function (error, result) {
        if (error) console.log(error);
        else {
          images.push({
            id: user.id,
            username: user.username,
            height: result?.height,
            width: result?.width,
            size: result?.size,
          });

          console.log({
            id: user.id,
            username: user.username,
            height: result?.height,
            width: result?.width,
            size: result?.size,
          });
        }
      });
    });
    console.log(`Done ${user.username}`);
  });

  // if(images.length > 0) {
  //   images.forEach(async (image) => {

  //   })
  // }
};
