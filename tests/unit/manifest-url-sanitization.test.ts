import { describe, test, expect } from 'vitest';

import { createNewManifest } from '../../src/domain/valueObjects/Manifest';

describe('URL Sanitization in Manifest', () => {
  describe('Links with URLs containing query parameters', () => {
    test('It should preserve URLs with query parameters', () => {
      const payload = {
        spec: {
          repo: 'test/repo',
          name: 'test-service',
          description: 'Test Service'
        },
        links: [
          {
            title: 'Documentation',
            url: 'https://example.com/docs?version=v1&lang=en',
            icon: 'documentation'
          }
        ]
      };

      const manifest = createNewManifest(payload);
      
      expect(manifest.links).toBeDefined();
      expect(manifest.links?.[0].url).toContain('?');
      expect(manifest.links?.[0].url).toContain('=');
      expect(manifest.links?.[0].url).toContain('&');
    });

    test('It should preserve URLs with hash anchors', () => {
      const payload = {
        spec: {
          repo: 'test/repo',
          name: 'test-service',
          description: 'Test Service'
        },
        links: [
          {
            title: 'Documentation',
            url: 'https://example.com/docs#section-api',
            icon: 'documentation'
          }
        ]
      };

      const manifest = createNewManifest(payload);
      
      expect(manifest.links).toBeDefined();
      expect(manifest.links?.[0].url).toContain('#');
    });

    test('It should preserve complex URLs with both query parameters and hash anchors', () => {
      const payload = {
        spec: {
          repo: 'test/repo',
          name: 'test-service',
          description: 'Test Service'
        },
        links: [
          {
            title: 'Confluence',
            url: 'https://confluence.example.com/wiki/spaces/DOCS/pages/12345?version=1#section',
            icon: 'documentation'
          }
        ]
      };

      const manifest = createNewManifest(payload);
      
      expect(manifest.links).toBeDefined();
      expect(manifest.links?.[0].url).toContain('?');
      expect(manifest.links?.[0].url).toContain('=');
      expect(manifest.links?.[0].url).toContain('#');
    });

    test('It should preserve Atlassian confluence URLs', () => {
      const payload = {
        spec: {
          repo: 'test/repo',
          name: 'test-service',
          description: 'Test Service'
        },
        links: [
          {
            title: 'Confluence documentation',
            url: 'https://my-confluence.atlassian.net/wiki/spaces/DEV/pages/123456789/',
            icon: 'documentation'
          }
        ]
      };

      const manifest = createNewManifest(payload);
      
      expect(manifest.links).toBeDefined();
      expect(manifest.links?.[0].url).toBe('https://my-confluence.atlassian.net/wiki/spaces/DEV/pages/123456789/');
    });

    test('It should preserve APIs with query parameter schema paths', () => {
      const payload = {
        spec: {
          repo: 'test/repo',
          name: 'test-service',
          description: 'Test Service'
        },
        api: [
          {
            name: 'OpenAPI Schema',
            schemaPath: 'https://example.com/schema/openapi.json?version=3.0&format=yaml'
          }
        ]
      };

      const manifest = createNewManifest(payload);
      
      expect(manifest.api).toBeDefined();
      expect(manifest.api?.[0].schemaPath).toContain('?');
      expect(manifest.api?.[0].schemaPath).toContain('&');
    });
  });

  describe('Edge cases for URL sanitization', () => {
    test('It should handle URLs with multiple query parameters', () => {
      const payload = {
        spec: {
          repo: 'test/repo',
          name: 'test-service',
          description: 'Test Service'
        },
        links: [
          {
            title: 'Documentation',
            url: 'https://example.com/docs?page=1&section=api&version=v2&format=html',
            icon: 'documentation'
          }
        ]
      };

      const manifest = createNewManifest(payload);
      
      expect(manifest.links?.[0].url).toContain('page=1');
      expect(manifest.links?.[0].url).toContain('section=api');
      expect(manifest.links?.[0].url).toContain('version=v2');
    });

    test('It should respect maximum URL length after sanitization', () => {
      const veryLongUrl = 'https://example.com/' + 'a'.repeat(500) + '?param=value';
      
      const payload = {
        spec: {
          repo: 'test/repo',
          name: 'test-service',
          description: 'Test Service'
        },
        links: [
          {
            title: 'Documentation',
            url: veryLongUrl,
            icon: 'documentation'
          }
        ]
      };

      const manifest = createNewManifest(payload);
      
      // Should be capped at 500 characters for values
      expect(manifest.links?.[0].url.length).toBeLessThanOrEqual(500);
    });
  });

  describe('Sanitization still blocks malicious characters', () => {
    test('It should still remove script tags and other HTML', () => {
      const payload = {
        spec: {
          repo: 'test/repo',
          name: 'test-service',
          description: 'Test Service'
        },
        links: [
          {
            title: 'Documentation',
            url: 'https://example.com/docs<script>alert("xss")</script>',
            icon: 'documentation'
          }
        ]
      };

      const manifest = createNewManifest(payload);
      
      expect(manifest.links?.[0].url).not.toContain('<');
      expect(manifest.links?.[0].url).not.toContain('>');
    });
  });
});
