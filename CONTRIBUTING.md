# Contributing

Thank you for your interest in contributing to the guild.xyz interface!

Before making any changes, please first discuss it via issue,
on [Discord](https://discord.gg/busbpKQUSq), or any other method with the core team.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Development

### Running the interface locally:

1. `npm i`
1. `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Creating a production build

1. `npm i`
1. `npm run build`

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Guidelines

The following points should help guide your development:

- Security: the interface is safe to use
  - Avoid adding unnecessary dependencies due to [supply chain risk](https://github.com/LavaMoat/lavamoat#further-reading-on-software-supplychain-security)
- Reproducibility: anyone can build the interface
  - Avoid adding steps to the development/build processes
  - The build must be deterministic, i.e. a particular commit hash always produces the same build
- Decentralization: anyone can run the interface
  - An Ethereum node should be the only critical dependency
  - All other external dependencies should only enhance the UX ([graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation))
- Accessibility: anyone can use the interface
  - The interface should be responsive, small and run well on low performance devices
