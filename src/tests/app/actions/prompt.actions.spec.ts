import { searchPromptAction } from '@/app/actions/prompt-actions';

jest.mock('@/lib/prisma', () => ({
  prisma: {},
}));

const mockedSearchExecute = jest.fn();

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}));

describe('Serve Actions: Prompts', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
  });

  describe('searchPromptAction', () => {
    it('should return success with term search not empty', async () => {
      const input = [
        {
          id: '1',
          title: 'AI Tittle',
          content: 'how can I use AI in my life',
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', 'AI');

      const result = await searchPromptAction({ success: true }, formData);
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should return success and list prompts where all terms is empty', async () => {
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'content 01',
        },
        {
          id: '2',
          title: 'Tittle 02',
          content: 'content 02',
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);
      const formData = new FormData();
      formData.append('q', '');

      const result = await searchPromptAction(
        {
          success: true,
        },
        formData
      );

      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });

    it('should return a generic error when search failed', async () => {
      const error = new Error('UNKNOWN');
      mockedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.append('q', 'error');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.prompts).toBe(undefined);
      expect(result.message).toBe('falha ao buscar prompts');
    });

    it('should trim term space before execute', async () => {
      const input = [
        {
          id: '1',
          title: 'AI Tittle',
          content: 'how can I use AI in my life',
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', '     AI Tittle     ');

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith('AI Tittle');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should treat the absence of a query as an empty term', async () => {
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'content 01',
        },
        {
          id: '2',
          title: 'Tittle 02',
          content: 'content 02',
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith('');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
  });
});
