import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../Components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {

    state = {
        newRepo: '',
        repositories: '',
        loading: false
    }

    //Carregar os dados do localstorage
    componentDidMount() {
        const repositories = localStorage.getItem('repositories');
        if (repositories) this.setState({ repositories: JSON.parse(repositories) });
    }

    //Salvar os dados do localstorage
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;
        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleChange = e => {
        this.setState({ newRepo: e.target.value });
    };


    handleSubmit = async  e => {
        e.preventDefault();

        this.setState({ loading: true })

        const { newRepo, repositories } = this.state;

        const response = await api.get(`/repos/${newRepo}`);

        const data = {
            name: response.data.full_name
        };

        this.setState({
            repositories: [...repositories, data],
            newRepo: '',
            loading: false
        });
    };

    render() {
        const { newRepo, repositories, loading } = this.state;
        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleChange}
                    />

                    <SubmitButton loading={loading ? 1 : 0}>
                        {!loading ?
                            (<FaPlus color="#FFF" font={14} />) :
                            (<FaSpinner color="#FFF" font={14} />)
                        }
                    </SubmitButton>
                </Form>

                <List>
                    {repositories && repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            {/* encodeURIComponent converte todos os caracteres de barra, nesse caso, para um valor
                                deixando nossa url mais limpa
                            */}
                            <Link to={`/repositories/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container >
        );
    }
}


