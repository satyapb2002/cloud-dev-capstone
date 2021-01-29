import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Label
} from 'semantic-ui-react'

import { createExcercise, deleteExcercise, getExcercises, patchExcercise } from '../api/excercises-api'
import Auth from '../auth/Auth'
import { Excercise } from '../types/Excercise'

interface ExcercisesProps {
  auth: Auth
  history: History
}

interface ExcercisesState {
  excercises: Excercise[]
  newExcerciseName: string
  loadingExcercises: boolean
}

export class Excercises extends React.PureComponent<ExcercisesProps, ExcercisesState> {
  state: ExcercisesState = {
    excercises: [],
    newExcerciseName: '',
    loadingExcercises: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExcerciseName: event.target.value })
  }

  onEditButtonClick = (excerciseId: string) => {
    this.props.history.push(`/excercises/${excerciseId}/edit`)
  }

  onExcerciseCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      if(this.state.newExcerciseName == ""){
        alert('Please enter excercise name')
        return
      }
      const calorie = '0'
      const newExcercise = await createExcercise(this.props.auth.getIdToken(), {
        name: this.state.newExcerciseName,
        calorie 
      })
      this.setState({
        excercises: [...this.state.excercises, newExcercise],
        newExcerciseName: ''
      })
    } catch {
      alert('Excercise creation failed')
    }
  }

  onExcerciseDelete = async (excerciseId: string) => {
    try {
      await deleteExcercise(this.props.auth.getIdToken(), excerciseId)
      this.setState({
        excercises: this.state.excercises.filter(excercise => excercise.excerciseId != excerciseId)
      })
    } catch {
      alert('Excercise deletion failed')
    }
  }

  onExcerciseCheck = async (pos: number) => {
    try {
      const excercise = this.state.excercises[pos]
      await patchExcercise(this.props.auth.getIdToken(), excercise.excerciseId, {
        name: excercise.name,
        calorie : excercise.calorie,
      })
    } catch {
      alert('Excercise deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const excercises = await getExcercises(this.props.auth.getIdToken())
      this.setState({
        excercises: excercises,
        loadingExcercises: false
      })
    } catch (e) {
      alert(`Failed to fetch excercises: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Excercises</Header>

        {this.renderCreateExcerciseInput()}

        {this.renderExcercises()}
      </div>
    )
  }

  renderCreateExcerciseInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Excercise',
              onClick: this.onExcerciseCreate
            }}
            fluid
            actionPosition="left"
            value={this.state.newExcerciseName}
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderExcercises() {
    if (this.state.loadingExcercises) {
      return this.renderLoading()
    }

    return this.renderExcercisesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Excercises
        </Loader>
      </Grid.Row>
    )
  }

  renderExcercisesList() {
    return (
      <Grid padded>
        {this.state.excercises.map((excercise, pos) => {
          return (
            <Grid.Row key={excercise.excerciseId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onExcerciseCheck(pos)}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {excercise.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {excercise.calorie}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(excercise.excerciseId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onExcerciseDelete(excercise.excerciseId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {excercise.attachmentUrl && (
                <Image src={excercise.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
      
    )
  }

   

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
