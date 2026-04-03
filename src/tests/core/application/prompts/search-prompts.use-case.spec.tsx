import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { Prompt } from '@/core/domain/prompts/prompt.entity';
import { PromptRepository } from '@/core/domain/prompts/prompt.repository';

describe('SearchPromptUseCase', () => {
  const input: Prompt[] = [
    {
      id: '1',
      title: 'First title 01',
      content: 'Content 01',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'First title 02',
      content: 'Content 02',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const repository: PromptRepository = {
    findMany: async () => input,
    searchMany: async (term) =>
      input.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(term.toLocaleLowerCase()) ||
          prompt.content.toLowerCase().includes(term.toLocaleLowerCase())
      ),
  };

  it('should return all prompts when term is empty', async () => {
    const useCase = new SearchPromptsUseCase(repository);

    const results = await useCase.execute('');

    expect(results).toHaveLength(2);
  });

  it('should filter prompt list by search term', async () => {
    const useCase = new SearchPromptsUseCase(repository);
    const query = 'First title 01';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('should apply trim in a search term with space in blank and return all prompt list', async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = '   ';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(2);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });

  it('should term search with blank spaces, resolved in with trim', async () => {
    const firstElement = input.slice(0, 1);
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue(firstElement);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = ' First title 02  ';

    const results = await useCase.execute(query);

    expect(results).toMatchObject(firstElement);
    expect(searchMany).toHaveBeenCalledWith(query.trim());
    expect(findMany).not.toHaveBeenCalled();
  });

  it('should to lead with undefined or null term and return all prompt list', async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = undefined as unknown as string;

    const results = await useCase.execute(query);

    expect(results).toMatchObject(input);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });
});
