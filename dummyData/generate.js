import fs from 'fs';

// Sample movie titles, summaries, and release years
const movieTitles = [
    "The Shawshank Redemption",
    "The Godfather",
    "The Dark Knight",
    "Inception",
    "Forrest Gump",
    "The Matrix",
    "Gladiator",
    "The Avengers",
    "The Lion King",
    "Titanic",
    "The Silence of the Lambs",
    "Pulp Fiction",
    "The Lord of the Rings: The Return of the King",
    "The Empire Strikes Back",
    "Interstellar",
    "Fight Club",
    "The Social Network",
    "The Departed",
    "Schindler's List",
    "Star Wars: A New Hope",
    "The Godfather: Part II",
];

const summaries = [
    "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    "When the menace known as The Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
    "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    "The presidencies of Kennedy and Johnson, the Vietnam War, the civil rights movement, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an extraordinary name, Forrest Gump.",
    "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    "A former Roman general sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    "Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity.",
    "A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.",
    "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    "A young FBI cadet must confide in an incarcerated and manipulative cannibal killer to receive his help on catching another serial killer who skins his victims.",
    "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    "The hobbit, Frodo Baggins, and eight companions set out on a quest to destroy the powerful One Ring and bring an end to Sauron's reign of terror.",
    "The rebels join forces with the fleet of the Empire to overthrow the evil forces of the Sith and bring peace to the galaxy.",
    "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    "An insomniac office worker forms an underground fight club with soap salesman Tyler Durden.",
    "Mark Zuckerberg creates the social networking site that would become known as Facebook, but the creation of Facebook comes at a price.",
    "A former cop turned private detective is hired to investigate the disappearance of a high-profile woman in Boston.",
    "The story of the Holocaust, focusing on the efforts of a German businessman to save the lives of over a thousand Polish Jews during World War II.",
    "A group of rebels seek to destroy the Death Star, a space station with enough power to destroy an entire planet.",
    "The continuation of Michael Corleone's saga of trying to establish a new criminal empire while grappling with betrayal.",
];

// Generate random release years between 1950 and 2020
function randomDateRelease() {
    const year = Math.floor(Math.random() * (2020 - 1950 + 1)) + 1950;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0"); // To ensure valid day
    return `${year}-${month}-${day}`;
}

const imageURLs = [
    "https://graphicdesignjunction.com/wp-content/uploads/2012/05/large/movie-poster-20.jpg",
    "https://www.slashfilm.com/wp/wp-content/images/2017-bestposter-thorragnarok.jpg",
    "https://images2.fanpop.com/images/photos/8400000/Movie-Posters-movies-8405245-1224-1773.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/61da8438155793.57575971afe13.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/868e2d38155793.57575971b116a.jpg",
    "https://wallpapercave.com/wp/wp10941904.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/e22ff753131197.596c4c560ae3b.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c358f738155793.57575971b1c09.jpg",
    "https://www.slashfilm.com/wp/wp-content/images/2017-bestposter-justiceleague.jpg",
    "https://wallpapercave.com/wp/wp7490940.jpg",
    "https://wallpapercave.com/wp/wp1945933.jpg",
]

// Generate 200 movie objects
const movies = [];
for (let i = 0; i < 200; i++) {
    const movie = {
        title: movieTitles[Math.floor(Math.random() * movieTitles.length)],
        summary: summaries[Math.floor(Math.random() * summaries.length)],
        dateRelease: randomDateRelease(),
        image: imageURLs[Math.floor(Math.random() * imageURLs.length)]
    };
    movies.push(movie);
}

// Output the generated movies (or you can store them to a file)
//console.log(movies); // Show first 5 items as a sample for verification

fs.writeFile('dummyData/movies.json', JSON.stringify(movies, null, 2), (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Movies data has been written to dummyData/movies.json');
    }
});