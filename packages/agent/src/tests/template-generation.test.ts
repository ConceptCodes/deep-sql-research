import { describe, it, expect, beforeAll } from 'bun:test';
import { graph } from '../agent/graph';
import { readFile } from 'fs/promises';
import path from 'path';
import type { TemplateJson } from '@deep-sql-research/shared';

describe('Template Generation', () => {
  const fixturesDir = path.join(__dirname, '..', 'fixtures');
  
  describe('Basic Research Template', () => {
    let result: any;
    
    beforeAll(async () => {
      const fixture = JSON.parse(await readFile(path.join(fixturesDir, 'basic-research.json'), 'utf-8'));
      result = await graph.invoke(fixture);
    });

    it('should generate a complete template', () => {
      expect(result.templateJson).not.toBeNull();
      expect(result.templateJson).toMatchObject({
        version: expect.any(String),
        compositionId: expect.any(String),
        meta: expect.objectContaining({
          title: expect.any(String),
          description: expect.any(String),
          generatedAt: expect.any(String),
          dataSource: expect.any(String),
        }),
        dataBindings: expect.objectContaining({
          insights: expect.any(Array),
        }),
        narrative: expect.objectContaining({
          title: expect.any(String),
          sections: expect.any(Array),
        }),
        scenes: expect.any(Array),
        timeline: expect.objectContaining({
          scenes: expect.any(Array),
          totalDuration: expect.any(Number),
        }),
        cards: expect.any(Array),
        theme: expect.objectContaining({
          primary: expect.any(String),
          secondary: expect.any(String),
          accent: expect.any(String),
          background: expect.any(String),
          surface: expect.any(String),
        }),
        animationProfile: expect.objectContaining({
          speed: expect.any(String),
          style: expect.any(String),
        }),
      });
    });

    it('should generate insights', () => {
      expect(result.insights).toBeInstanceOf(Array);
      expect(result.insights.length).toBeGreaterThan(0);
    });

    it('should have consistent data bindings', () => {
      const { templateJson, insights } = result;
      expect(templateJson.dataBindings.insights).toEqual(insights);
    });

    it('should match snapshot', () => {
      expect(result.templateJson).toMatchSnapshot('basic-research-template');
    });
  });

  describe('Comparison Research Template', () => {
    let result: any;
    
    beforeAll(async () => {
      const fixture = JSON.parse(await readFile(path.join(fixturesDir, 'comparison-research.json'), 'utf-8'));
      result = await graph.invoke(fixture);
    });

    it('should generate a complete template', () => {
      expect(result.templateJson).not.toBeNull();
    });

    it('should match snapshot', () => {
      expect(result.templateJson).toMatchSnapshot('comparison-research-template');
    });
  });

  describe('Trend Analysis Template', () => {
    let result: any;
    
    beforeAll(async () => {
      const fixture = JSON.parse(await readFile(path.join(fixturesDir, 'trend-analysis.json'), 'utf-8'));
      result = await graph.invoke(fixture);
    });

    it('should generate a complete template', () => {
      expect(result.templateJson).not.toBeNull();
    });

    it('should match snapshot', () => {
      expect(result.templateJson).toMatchSnapshot('trend-analysis-template');
    });
  });
});