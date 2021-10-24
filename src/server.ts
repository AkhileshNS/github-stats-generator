// IMPORTS
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { getRepoCount, getReposStats } from './graphql/requests';

// VARIABLES
const app = express();
const port = process.env.PORT || 8080;

// MIDDLEWARE
app.use(compression());
app.use(helmet());
app.use(express.json());

// ROUTES
app.post('/repos/count', async (req, res) => {
  try {
    const {token, name} = req.body;

    if (!token || !name) {
      throw new Error("Missing token or name in body");
    }

    const repoCount = await getRepoCount(token, name);
    res.status(200).send({repoCount});
  } catch (err) {
    res.send({
      error: "Error making your request",
      err
    })
  }
});

app.post('/repos/stats/raw', async (req, res) => {
  try {
    const {token, name} = req.body;

    if (!token || !name) {
      throw new Error("Missing token or name in body");
    }

    const reposStats = await getReposStats(token, name);
    res.status(200).send({repoCount: reposStats.length, reposStats});
  } catch (err) {
    res.send({
      error: "Error making your request",
      err
    })
  }
});

// BINDING
app.listen(port, () => console.log(`Example app listening on port ${port}`));
