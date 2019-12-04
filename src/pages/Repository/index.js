import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import api from '../../services/api';
import Container from '../../Components/Container';
import { Loading, Owner, IssueList } from './styles';

/** match
 *  uma propriedade dentro das nossas rotas, podemos pegar parametros dentre outros valores
 *  que sejam passados de uma rota para outra.
 */
export default class Repository extends Component {

    static propTypes = {
        match: PropTypes.shape({ // Usamos o tipo shape para props do tipo objeto
            params: PropTypes.shape({
                repository: PropTypes.string,
            })
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        loading: true
    };

    async componentDidMount() {

        const { match } = this.props;

        const repoName = decodeURIComponent(match.params.repository);

        /** Com essa promise fazemos com que as duas requisições sejam feitas juntas
         *  e para pegar o valor de cada requisição utilizamos o object destructuring
         *  assim o primeiro indice atribuimos a uma variavel repository e o segundo a
         * issue. O valor dos mesmos são respectivamente o de cada chamada em sequencia
         */

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                }
            })
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false
        });
    }


    render() {

        const { repository, issues, loading } = this.state;

        if (loading) {
            return <Loading>Carregando ...</Loading>
        }

        return (
            <Container>
                <Owner>
                    <Link to="/">Voltar aos repositórios</Link>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>

                <IssueList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img src={issue.user.avatar_url} alt={issue.user.login} />
                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>{label.name}</span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))

                    }
                </IssueList>
            </Container>
        );
    }
}
