# cloudoc

cloudoc analyzes embedded local images in markdown, uploads them to [Cloudup](https://cloudup.com),
and automatically replaces their links.

## Installation

```
git clone git@github.com:hitsujiwool/cloudoc
cd cloudoc
npm link
```

## Usage

```
Usage: cloudoc [options] <file>

Options:

  -h, --help                output usage information
  -V, --version             output the version number
  -t, --title <title>        title of stream
  -u, --user <username>      username
  -p, --password <password>  password
```

## Example

```
cloudoc example/input.md -u myusername -p mypassword -t lovelysheep > example/out.md
```

Before (input.md):  
```
![lovelysheep](lovelysheep.png)
```

After (output.md):
```
![lovelysheep](http://i.cloudup.com/uqEMUUiqoBO/y6pnTw.png)
```
