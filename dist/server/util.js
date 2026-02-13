import prisma from "../lib/prisma.js";
export async function Reset() {
    console.log("Starting");
    try {
        console.log("Deleting");
        await prisma.category.deleteMany();
        console.log("Delete success");
    }
    catch (error) {
        console.log(error);
        console.log("Well something went wrong");
        return;
    }
    try {
        console.log("Creating");
        await prisma.category.createMany({ data: [
                { name: "Linear Algebra" },
                { name: "Phonetic English" },
                { name: "Pop Culture" },
                { name: "Movies and TV shows" },
                { name: "Reality TV" },
                { name: "Hip-Hop Culture" },
                { name: "Game of Thrones" },
                { name: "Current Affairs" },
                { name: "Astronomy" },
                { name: "Astrology" },
                { name: "Anime" },
                { name: "Social Media" },
                { name: "History" },
                { name: "Random Trivia" },
                { name: "Animals" },
                { name: "Philosophy" },
                { name: "Music" },
                { name: "Modern Art" },
                { name: "Video Games" },
                { name: "Woodwork" },
                { name: "Chemistry" },
                { name: "Biology" }
            ] });
    }
    catch (error) {
        console.log("error");
        console.log("Well something went wrong");
    }
}
Reset();
