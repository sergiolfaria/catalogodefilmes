"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_1 = __importDefault(require("./data"));
const app = (0, express_1.default)();
const PORTA = 3003;
const AUTH_TOKEN = '12345678';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === AUTH_TOKEN) {
        next();
    }
    else {
        res.status(401).json({ error: 'Autenticação falhou. Token inválido.' });
    }
};
app.use(authenticate);
app.get('/filmes', (req, res) => {
    res.status(200).json({ filmes: data_1.default });
});
app.get('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const filme = data_1.default.find(f => f.id === id);
    if (filme) {
        res.status(200).json(filme);
    }
    else {
        res.status(404).json({ error: 'Filme não encontrado.' });
    }
});
app.get('/filmes/diretor/:diretor', (req, res) => {
    const diretor = decodeURIComponent(req.params.diretor);
    const filmesDoDiretor = data_1.default.filter(f => f.diretor === diretor);
    if (filmesDoDiretor.length > 0) {
        res.status(200).json({ filmes: filmesDoDiretor });
    }
    else {
        res.status(404).json({ error: 'Nenhum filme encontrado para esse diretor.' });
    }
});
const validarCamposFilme = (filme) => {
    const { titulo, diretor, ano_lancamento, genero, atores, sinopse, classificacao } = filme;
    return !(!titulo || !diretor || !ano_lancamento || !genero || !atores || !sinopse || !classificacao);
};
app.post('/filmes', (req, res) => {
    const novoFilme = req.body;
    if (!validarCamposFilme(novoFilme)) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    data_1.default.push(novoFilme);
    res.status(201).json(novoFilme);
});
app.put('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = data_1.default.findIndex(f => f.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Filme não encontrado.' });
    }
    const filmeAtualizado = req.body;
    if (!validarCamposFilme(filmeAtualizado)) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    const filmeAtualizadoComID = Object.assign({ id: data_1.default[index].id }, filmeAtualizado);
    data_1.default[index] = filmeAtualizadoComID;
    res.status(200).json(filmeAtualizadoComID);
});
app.delete('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = data_1.default.findIndex(f => f.id === id);
    if (index !== -1) {
        data_1.default.splice(index, 1);
        res.status(200).json({ message: `Filme com ID ${id} foi excluído com sucesso.` });
    }
    else {
        res.status(404).json({ error: 'Filme não encontrado.' });
    }
});
app.listen(PORTA, () => {
    console.log(`Server is running on port ${PORTA}`);
});
