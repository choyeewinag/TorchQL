const TypeGenerator = require('../generators/typeGenerator');
const ResolverGenerator = require('../generators/resolverGenerator');

const SchemaGenerator = {};
// assembles all programmatic schema and resolvers together in one string
SchemaGenerator.assembleSchema = function assembleSchema(tables) {
  let queryType = '';
  let mutationType = '';
  let customTypes = '';
  let queryResolvers = '';
  let mutationResolvers = '';
  for (let tableName in tables) {
    const tableData = tables[tableName];
    queryType += TypeGenerator.queries(tableName, tableData);
    mutationType += TypeGenerator.mutations(tableName, tableData);
    customTypes += TypeGenerator.customTypes(tableName, tables);
    queryResolvers += ResolverGenerator.queries(tableName, tableData);
    mutationResolvers += ResolverGenerator.mutations(tableName, tableData)
  }
  return 'const typeDefs = `\n'
    + '  type Query {\n'
    + `${queryType}`
    + '  }\n\n'
    + '  type Mutation {\n'
    + `${mutationType}`
    + '  }\n\n'
    + `${customTypes}\`;\n\n`
    + 'const resolvers = {\n'
    + '  Query: {'
    + `    ${queryResolvers}\n`
    + '  },\n\n'
    + '  Mutation: {\n'
    + `${mutationResolvers}`
    + '  }\n'
    + '}\n\n'
    + 'const schema = makeExecutableSchema({\n'
    + '  typeDefs,\n'
    + '  resolvers,\n'
    + '});\n\n'
    + 'module.exports = schema;';
};

module.exports = SchemaGenerator;