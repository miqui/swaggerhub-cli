const { Command } = require('@oclif/command')
const inquirer = require('inquirer')
const { getPrompts } = require('../support/inquirer')
const { setConfig, getConfig } = require('../config')
const { getRegistryDefinition } = require('../actions/swaggerhub')
const { parseResponse } = require('../support/command/response-handler')
const { hasJsonStructure } = require('../utils/general')
const { CLIError } = require('@oclif/errors')

class ConfigureCommand extends Command {

  async run() {
    const prompts = getPrompts(['swaggerHubUrl','apiKey'])(getConfig())
    await inquirer.prompt(prompts)
                  .then(setConfig)
    
    await getRegistryDefinition()
          .then(parseResponse)
          .then(response => {
            if (hasJsonStructure(response.content)) {
              const json = JSON.parse(response.content)
              if (json.info && json.info.title == 'SwaggerHub Registry API') {
                return
              }
            }

            throw new CLIError('Misconfigured URL')
          })
  }
}

ConfigureCommand.description = `configure application settings
Enter the SwaggerHub URL - default is https://api.swaggerhub.com
Enter the API Key - this can be retrieved from https://app.swaggerhub.com/settings/apiKey
You can set these as environment variables: SWAGGERHUB_URL, SWAGGERHUB_API_KEY. These take priority over config settings.
`
module.exports = ConfigureCommand
