import express from 'express';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const JSONPLACEHOLDER_BASE = "https://jsonplaceholder.typicode.com";

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function fetchWithCache(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

const indianData = [
  { name: "Aarav Sharma", username: "aarav_sharma", city: "Mumbai", phone: "+91 98765 43210", website: "instagram.com/aarav_sharma" },
  { name: "Priya Patel", username: "priya_patel", city: "Delhi", phone: "+91 87654 32109", website: "instagram.com/priya_patel" },
  { name: "Arjun Reddy", username: "arjun_reddy", city: "Hyderabad", phone: "+91 76543 21098", website: "instagram.com/arjun_reddy" },
  { name: "Ananya Gupta", username: "ananya_gupta", city: "Bangalore", phone: "+91 65432 10987", website: "instagram.com/ananya_gupta" },
  { name: "Rohan Mehta", username: "rohan_mehta", city: "Chennai", phone: "+91 54321 09876", website: "instagram.com/rohan_mehta" },
  { name: "Ishita Singh", username: "ishita_singh", city: "Kolkata", phone: "+91 43210 98765", website: "instagram.com/ishita_singh" },
  { name: "Vihaan Kumar", username: "vihaan_kumar", city: "Pune", phone: "+91 32109 87654", website: "instagram.com/vihaan_kumar" },
  { name: "Aisha Khan", username: "aisha_khan", city: "Jaipur", phone: "+91 21098 76543", website: "instagram.com/aisha_khan" },
  { name: "Kabir Joshi", username: "kabir_joshi", city: "Ahmedabad", phone: "+91 10987 65432", website: "instagram.com/kabir_joshi" },
  { name: "Diya Verma", username: "diya_verma", city: "Lucknow", phone: "+91 99887 76655", website: "instagram.com/diya_verma" },
];

app.get("/api/users", async (_req, res) => {
  try {
    const users = await fetchWithCache(`${JSONPLACEHOLDER_BASE}/users`);
    const updatedUsers = users.map((user, index) => ({
      ...user,
      name: indianData[index]?.name || user.name,
      username: indianData[index]?.username || user.username,
      email: `${indianData[index]?.username || user.username}@email.com`,
      phone: indianData[index]?.phone || user.phone,
      website: indianData[index]?.website || user.website,
      address: {
        ...user.address,
        city: indianData[index]?.city || user.address.city,
        street: "MG Road",
        suite: `Apt ${index + 101}`,
        zipcode: `${400000 + index * 1000}`,
      },
    }));
    res.json(updatedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await fetchWithCache(`${JSONPLACEHOLDER_BASE}/users/${id}`);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.get("/api/users/:id/posts", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await fetchWithCache(`${JSONPLACEHOLDER_BASE}/users/${id}/posts`);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

app.get("/api/posts", async (_req, res) => {
  try {
    const allPosts = await fetchWithCache(`${JSONPLACEHOLDER_BASE}/posts`);
    const posts = allPosts.slice(0, 20);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await fetchWithCache(`${JSONPLACEHOLDER_BASE}/posts/${id}`);
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

app.get("/api/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await fetchWithCache(`${JSONPLACEHOLDER_BASE}/posts/${id}/comments`);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

app.get("/api/comments/counts", async (_req, res) => {
  try {
    const comments = await fetchWithCache(`${JSONPLACEHOLDER_BASE}/comments`);
    const counts = {};
    comments.forEach((comment) => {
      counts[comment.postId] = (counts[comment.postId] || 0) + 1;
    });
    const result = Object.entries(counts).map(([postId, count]) => ({
      postId: parseInt(postId),
      count,
    }));
    res.json(result);
  } catch (error) {
    console.error("Error fetching comment counts:", error);
    res.status(500).json({ error: "Failed to fetch comment counts" });
  }
});

export default app;


