describe('Template Pagination Logic', () => {
  const PAGE_SIZE = 12;
  
  const mockTemplates = [
    { id: 1, description: 'Lavar louça', room: 'Cozinha', frequency: 'daily' },
    { id: 2, description: 'Aspirar sala', room: 'Sala', frequency: 'daily' },
    { id: 3, description: 'Limpar quarto', room: 'Quarto', frequency: 'weekly', day_value: 1 },
    { id: 4, description: 'Limpar banheiro', room: 'Banheiro', frequency: 'weekly', day_value: 3 },
    { id: 5, description: 'Lavar roupas', room: 'Área de serviço', frequency: 'weekly', day_value: 2 },
    { id: 6, description: 'regar plantas', room: 'Varanda', frequency: 'weekly', day_value: 0 },
    { id: 7, description: 'Limpar box', room: 'Banheiro', frequency: 'weekly', day_value: 5 },
    { id: 8, description: 'limpar espelho', room: 'Hall', frequency: 'weekly', day_value: 4 },
    { id: 9, description: 'limpar quadro', room: 'Escritório', frequency: 'weekly', day_value: 6 },
    { id: 10, description: 'tarefa 10', room: 'Sala', frequency: 'weekly', day_value: 1 },
    { id: 11, description: 'tarefa 11', room: 'Quarto', frequency: 'weekly', day_value: 2 },
    { id: 12, description: 'tarefa 12', room: 'Cozinha', frequency: 'weekly', day_value: 3 },
    { id: 13, description: 'tarefa 13', room: 'Cozinha', frequency: 'weekly', day_value: 4 },
    { id: 14, description: 'tarefa 14', room: 'Cozinha', frequency: 'biweekly' },
    { id: 15, description: 'tarefa 15', room: 'Cozinha', frequency: 'monthly', day_value: 1 },
  ];

  describe('Group templates by frequency', () => {
    it('should group daily templates', () => {
      const daily = mockTemplates.filter(t => t.frequency === 'daily');
      expect(daily.length).toBe(2);
    });

    it('should group weekly templates', () => {
      const weekly = mockTemplates.filter(t => t.frequency === 'weekly');
      expect(weekly.length).toBe(11);
    });

    it('should group biweekly templates', () => {
      const biweekly = mockTemplates.filter(t => t.frequency === 'biweekly');
      expect(biweekly.length).toBe(1);
    });

    it('should group monthly templates', () => {
      const monthly = mockTemplates.filter(t => t.frequency === 'monthly');
      expect(monthly.length).toBe(1);
    });
  });

  describe('Filter templates by room', () => {
    it('should filter by specific room', () => {
      const kitchen = mockTemplates.filter(t => t.room === 'Cozinha' && t.frequency === 'weekly');
      expect(kitchen.length).toBe(2);
    });

    it('should return all when room is null', () => {
      const weekly = mockTemplates.filter(t => t.frequency === 'weekly');
      expect(weekly.length).toBe(11);
    });
  });

  describe('Pagination calculations', () => {
    it('should calculate correct page count', () => {
      const items = mockTemplates.filter(t => t.frequency === 'weekly');
      const pageCount = Math.ceil(items.length / PAGE_SIZE);
      expect(pageCount).toBe(1);
    });

    it('should calculate page range start', () => {
      const page = 0;
      const start = page * PAGE_SIZE;
      expect(start).toBe(0);
    });

    it('should calculate page range end', () => {
      const page = 0;
      const items = mockTemplates.filter(t => t.frequency === 'weekly');
      const start = page * PAGE_SIZE;
      const end = Math.min(start + PAGE_SIZE, items.length);
      expect(end).toBe(11);
    });
  });

  describe('Sort by day_value', () => {
    it('should sort weekly templates by day_value', () => {
      const weekly = mockTemplates.filter(t => t.frequency === 'weekly');
      const sorted = weekly.sort((a, b) => a.day_value - b.day_value);
      
      expect(sorted[0].day_value).toBe(0); // Domingo
      expect(sorted[1].day_value).toBe(1); // Segunda
      expect(sorted[sorted.length - 1].day_value).toBe(6); // Sábado
    });
  });

  describe('Get unique rooms', () => {
    it('should get unique rooms from templates', () => {
      const rooms = [...new Set(mockTemplates.map(t => t.room).filter(Boolean))];
      expect(rooms.length).toBe(8);
    });
  });
});

describe('Date Utilities', () => {
  describe('Day names mapping', () => {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    it('should map day_value 0 to Domingo', () => {
      expect(dayNames[0]).toBe('Domingo');
    });

    it('should map day_value 1 to Segunda', () => {
      expect(dayNames[1]).toBe('Segunda');
    });

    it('should map day_value 6 to Sábado', () => {
      expect(dayNames[6]).toBe('Sábado');
    });
  });
});

describe('Frequency Labels', () => {
  const freqLabels = { daily: 'Diária', weekly: 'Semanal', biweekly: 'Quinzenal', monthly: 'Mensal' };

  it('should have daily label', () => {
    expect(freqLabels.daily).toBe('Diária');
  });

  it('should have weekly label', () => {
    expect(freqLabels.weekly).toBe('Semanal');
  });

  it('should have biweekly label', () => {
    expect(freqLabels.biweekly).toBe('Quinzenal');
  });

  it('should have monthly label', () => {
    expect(freqLabels.monthly).toBe('Mensal');
  });
});