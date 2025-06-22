# FilmesApp 🍿

Um aplicativo móvel de descoberta de filmes, construído com React Native e Expo, que permite aos usuários explorar, buscar e ver detalhes sobre seus filmes favoritos, utilizando a API do The Movie Database (TMDB).

Este projeto foi desenvolvido como um exercício prático para solidificar conceitos de desenvolvimento mobile, incluindo navegação avançada, consumo de APIs, gerenciamento de estado, componentização de interface e otimizações de performance.

![Prévia do App](assets/images/apresentacao.png)

---

## ✨ Funcionalidades

* **Tela de Splash:** Uma tela de boas-vindas que aparece na inicialização do app para uma experiência mais profissional.
* **Navegação por Abas:** Um menu de navegação inferior fixo e com estilo customizado para acesso rápido às seções principais: Home, Busca e Lista de Desejos (Watchlist).
* **Página Principal Dinâmica:**
    * Exibe um carrossel horizontal com os filmes em alta (`Trending`).
    * Permite filtrar filmes por categorias populares (Próximos, Em Cartaz, Melhor Avaliado, etc.), com a lista de "Próximos" sendo inteligentemente filtrada para mostrar apenas lançamentos futuros.
    * Usa uma `FlatList` otimizada com `ListHeaderComponent` para garantir alta performance, mesmo com conteúdo complexo.
* **Página de Descoberta Avançada (Aba de Busca):**
    * **Busca por Género:** Apresenta uma lista de géneros com imagens, permitindo ao utilizador explorar filmes por categoria.
    * **Busca por Texto:** Ao digitar, a interface muda para exibir resultados de busca em tempo real (com debounce para otimização).
    * **Filtros Avançados:** Na listagem por género, o utilizador pode aplicar múltiplos filtros de classificação etária (L, 10, 12, 14, 16, 18) através de um modal interativo.
    * **Paginação "Infinita":** Nas listas de género, novos filmes são carregados automaticamente conforme o utilizador rola a tela, com remoção de duplicados.
* **Página de Detalhes Completa:**
    * Layout profissional com imagem de fundo, gradiente e pôster sobreposto.
    * **Player de Trailer:** Botão de "Play" que abre um modal com o trailer do filme do YouTube incorporado (em iOS/Android) ou numa nova aba (na web).
    * Exibe informações detalhadas: título, nota, ano, duração, género principal, **classificação etária**, **diretores, argumentistas, orçamento e receita**.
    * Seções organizadas para "Sobre o Filme", "Onde Assistir" e "Elenco Principal".
* **Código Robusto e Multiplataforma:**
    * **TypeScript:** Todo o projeto é tipado para garantir segurança e manutenibilidade.
    * **Layout Responsivo:** Ajustes de interface específicos para iOS e Android (ex: barra de status e de navegação).
    * **Internacionalização:** Todas as informações da API são solicitadas em Português do Brasil (pt-BR).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

* **React Native:** Framework para desenvolvimento de aplicativos móveis.
* **Expo:** Plataforma e conjunto de ferramentas para facilitar o desenvolvimento, incluindo:
    * **Expo Router:** Para navegação baseada em arquivos, rotas dinâmicas e aninhadas (Stack/Tabs).
    * **Expo Font:** Para o carregamento de fontes customizadas (Montserrat).
    * **Expo Linear Gradient:** Para criar os efeitos de gradiente.
* **TypeScript:** Para adicionar tipagem estática e segurança ao código.
* **Axios:** Para fazer as chamadas à API do TMDB de forma simplificada.
* **React Native WebView:** Para incorporar o player do YouTube no modal do trailer.
* **The Movie Database (TMDB) API:** Como fonte de todos os dados de filmes, elenco e imagens.

---

## 🚀 Como Rodar o Projeto

Para rodar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
* [Git](https://git-scm.com/)
* O aplicativo **Expo Go** no seu smartphone (iOS ou Android)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/kauecavalcante/FilmesApp.git](https://github.com/kauecavalcante/FilmesApp.git)
    cd FilmesApp
    ```
    *(Lembre-se de substituir pelo seu URL correto)*

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Este projeto precisa de uma chave de API do TMDB para funcionar.
    * Na raiz do projeto, crie um arquivo chamado `.env`.
    * Dentro do `.env`, adicione a seguinte linha, substituindo `SUA_CHAVE_AQUI` pelo seu "Token de Acesso de Leitura da API" do TMDB:
        ```
        TMDB_ACCESS_TOKEN="SUA_CHAVE_AQUI"
        ```

4.  **Inicie o aplicativo:**
    ```bash
    npx expo start
    ```

5.  **Abra no seu celular:**
    * Com o servidor do Expo rodando, escaneie o QR Code que aparecerá no terminal usando o aplicativo Expo Go.

---