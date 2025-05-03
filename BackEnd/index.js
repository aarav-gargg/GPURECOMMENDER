import express from 'express';
import router from './routes/pricing.route.js'
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:5173" }));


app.use(express.json());

app.get('/', (req, res) => {
  res.send('GPU Cost Optimizer Backend is running');
});

app.use('/api/recommendations', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
