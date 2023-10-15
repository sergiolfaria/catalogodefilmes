import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import filmes from './data';

const app = express();
const PORTA = 3003;
const AUTH_TOKEN = '12345678';

app.use(cors());
app.use(express.json());

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token === AUTH_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Autenticação falhou. Token inválido.' });
  }
};

app.use(authenticate);

app.get('/filmes', (req: Request, res: Response) => {
  res.status(200).json({ filmes });
});

app.get('/filmes/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const filme = filmes.find(f => f.id === id);
  if (filme) {
    res.status(200).json(filme);
  } else {
    res.status(404).json({ error: 'Filme não encontrado.' });
  }
});
app.get('/filmes/diretor/:diretor', (req: Request, res: Response) => {
    const diretor = decodeURIComponent(req.params.diretor);
    const filmesDoDiretor = filmes.filter(f => f.diretor === diretor);
  
    if (filmesDoDiretor.length > 0) {
      res.status(200).json({ filmes: filmesDoDiretor });
    } else {
      res.status(404).json({ error: 'Nenhum filme encontrado para esse diretor.' });
    }
  });
  const validarCamposFilme = (filme: any): boolean => {
    const { titulo, diretor, ano_lancamento, genero, atores, sinopse, classificacao } = filme;
    return !(!titulo || !diretor || !ano_lancamento || !genero || !atores || !sinopse || !classificacao);
  };

  app.post('/filmes', (req: Request, res: Response) => {
    const novoFilme = req.body;

  if (!validarCamposFilme(novoFilme)) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  
    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
  });
  
  app.put('/filmes/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = filmes.findIndex(f => f.id === id);
  
    if (index === -1) {
      return res.status(404).json({ error: 'Filme não encontrado.' });
    }
  
    const filmeAtualizado = req.body;
  
    if (!validarCamposFilme(filmeAtualizado)) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const filmeAtualizadoComID = {
      id: filmes[index].id,
      ...filmeAtualizado,  
    };
   
    filmes[index] = filmeAtualizadoComID;
  
    res.status(200).json(filmeAtualizadoComID);
  });
  

app.delete('/filmes/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = filmes.findIndex(f => f.id === id);
  
    if (index !== -1) {
      filmes.splice(index, 1);
      res.status(200).json({ message: `Filme com ID ${id} foi excluído com sucesso.` });
    } else {
      res.status(404).json({ error: 'Filme não encontrado.' });
    }
  });
  

app.listen(PORTA, () => {
  console.log(`Server is running on port ${PORTA}`);
});
