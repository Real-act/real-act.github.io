// Exemples de scripts pré-enregistrés en Act
const codeTemplates = {
    hello: `// Bienvenue dans le langage Act !\nprint("Hello World!")\nprint("Act fonctionne à merveille.")`,
    
    variables: `// Les variables se créent avec 'let'\nlet pommes = 5\nlet oranges = 3\nlet total = pommes + oranges\n\nprint("Nombre total de fruits :")\nprint(total)`,
    
    condition: `// Système de conditions sans parenthèses\nlet vitesse = 120\n\nif vitesse > 110 {\n    print("Attention, vous roulez trop vite !")\n}\nelse {\n    print("Vitesse réglementaire, tout va bien.")\n}`
};

const editor = document.getElementById('code-editor');
const outputBox = document.getElementById('console-output');
const lineNumbers = document.getElementById('line-numbers');

// Charger le premier snippet au démarrage
document.addEventListener("DOMContentLoaded", () => {
    loadSnippet('hello');
});

// Met à jour la colonne des numéros de lignes à gauche
function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    let numbersArr = [];
    for (let i = 1; i <= lines; i++) {
        numbersArr.push(i);
    }
    lineNumbers.innerText = numbersArr.join('\n');
}

// Change de modèle de code quand on clique sur les onglets
function loadSnippet(name) {
    editor.value = codeTemplates[name];
    outputBox.innerText = "Cliquez sur Exécuter...";
    outputBox.style.color = "#64748b"; // Couleur grisée d'attente
    
    // Gérer l'état actif des onglets visuels
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(name.substring(0,3))) {
            btn.classList.add('active');
        }
    });

    updateLineNumbers();
}

// Appelle l'interpréteur au clic sur "Exécuter"
function executeActCode() {
    outputBox.innerText = "Compilation et exécution...";
    outputBox.style.color = "#34d399"; // Repasser au vert console

    setTimeout(() => {
        const interpreter = new ActInterpreter();
        const code = editor.value;
        const result = interpreter.run(code);
        
        outputBox.innerText = result || "Le programme s'est exécuté avec succès (aucune sortie).";
    }, 150);
}

// Permettre d'utiliser la touche Tabulation dans le textarea
editor.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
});
