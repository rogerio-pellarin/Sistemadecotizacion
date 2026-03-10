import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, RotateCcw, Clock } from 'lucide-react';
import { QuotationVersion } from '../types';

interface VersionHistoryProps {
  versions: QuotationVersion[];
  currentVersion: number;
  onBack: () => void;
  onRestore: (versionId: string) => void;
}

export function VersionHistory({
  versions,
  currentVersion,
  onBack,
  onRestore,
}: VersionHistoryProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4">
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Historial de Versiones</h1>
          <p className="text-sm text-gray-500 mt-1">
            Versión actual: {currentVersion}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Timeline de Cambios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {versions
                .slice()
                .reverse()
                .map((version, index) => (
                  <div key={version.id} className="flex gap-6">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          version.version === currentVersion
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {version.version}
                      </div>
                      {index < versions.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2 flex-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              Versión {version.version}
                              {version.version === currentVersion && (
                                <Badge className="bg-blue-100 text-blue-700">Actual</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Por: {version.modifiedBy}
                            </div>
                          </div>
                          {version.version !== currentVersion && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRestore(version.id)}
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restaurar
                            </Button>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 mt-3 mb-3">
                          {version.changes}
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(version.date).toLocaleString('es-CO')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {versions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay historial de versiones disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
