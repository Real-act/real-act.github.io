/**
 * Mini-Interpréteur pour le langage "Act"
 * Supporte : let, print, if/else, calculs simples, commentaires.
 */
class ActInterpreter {
    constructor() {
        this.variables = {};
        this.output = [];
    }

    run(code) {
        this.variables = {};
        this.output = [];
        
        // Nettoyage et découpage par lignes
        const lines = code.split('\n');
        let i = 0;

        try {
            while (i < lines.length) {
                let line = lines[i].trim();
                
                // Ignorer lignes vides et commentaires
                if (line === "" || line.startsWith("//")) {
                    i++;
                    continue;
                }

                // --- 1. Gestion de PRINT ---
                if (line.startsWith("print(")) {
                    let content = line.substring(6, line.lastIndexOf(")")).trim();
                    this.executePrint(content);
                }
                
                // --- 2. Gestion de LET (Variables) ---
                else if (line.startsWith("let ")) {
                    let statement = line.substring(4).trim();
                    let [varName, expr] = statement.split("=").map(s => s.trim());
                    if (!varName || !expr) throw new Error("Erreur de syntaxe sur la variable");
                    this.variables[varName] = this.evaluateExpression(expr);
                }

                // --- 3. Gestion de IF / ELSE ---
                else if (line.startsWith("if ")) {
                    let conditionPart = line.substring(3, line.indexOf("{")).trim();
                    let conditionMet = this.evaluateCondition(conditionPart);

                    // Capturer le bloc IF
                    let ifBlock = [];
                    i++;
                    while (i < lines.length && !lines[i].includes("}")) {
                        ifBlock.push(lines[i].trim());
                        i++;
                    }

                    let elseBlock = [];
                    // Vérifier s'il y a un ELSE juste après
                    if (i + 1 < lines.length && lines[i+1].trim().startsWith("else")) {
                        i++; // aller sur la ligne du else
                        i++; // entrer dans le bloc else
                        while (i < lines.length && !lines[i].includes("}")) {
                            elseBlock.push(lines[i].trim());
                            i++;
                        }
                    }

                    // Exécuter le bon bloc
                    let targetBlock = conditionMet ? ifBlock : elseBlock;
                    if (targetBlock.length > 0) {
                        let subCode = targetBlock.join("\n");
                        let subInterpreter = new ActInterpreter();
                        subInterpreter.variables = { ...this.variables };
                        subInterpreter.run(subCode);
                        this.output.push(...subInterpreter.output);
                        this.variables = { ...subInterpreter.variables };
                    }
                }
                i++;
            }
        } catch (error) {
            this.output.push(`[Erreur d'exécution Act]: ${error.message}`);
        }

        return this.output.join("\n");
    }

    executePrint(content) {
        // Si c'est une chaîne brute entre guillemets
        if (content.startsWith('"') && content.endsWith('"')) {
            this.output.push(content.slice(1, -1));
        } else {
            // Sinon on évalue la variable ou le calcul
            this.output.push(this.evaluateExpression(content));
        }
    }

    evaluateExpression(expr) {
        // Remplacer les variables connues par leur valeur dans l'expression
        let resolvedExpr = expr;
        for (let [key, val] of Object.entries(this.variables)) {
            let regex = new RegExp(`\\b${key}\\b`, 'g');
            resolvedExpr = resolvedExpr.replace(regex, val);
        }
        
        try {
            // Utilisation sécurisée pour simuler les opérations basiques (+, -, *, /)
            return Function(`"use strict"; return (${resolvedExpr})`)();
        } catch {
            throw new Error(`Expression invalide ou variable inconnue : "${expr}"`);
        }
    }

    evaluateCondition(cond) {
        let resolvedCond = cond;
        for (let [key, val] of Object.entries(this.variables)) {
            let regex = new RegExp(`\\b${key}\\b`, 'g');
            resolvedCond = resolvedCond.replace(regex, val);
        }
        try {
            return Function(`"use strict"; return (${resolvedCond})`)();
        } catch {
            throw new Error(`Condition impossible à évaluer : "${cond}"`);
        }
    }
}
